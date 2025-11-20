from __future__ import annotations

from flask import Blueprint, request, jsonify, current_app
import joblib
import pandas as pd
import numpy as np
import json
import re
import os

from config import (
    CKD_MODEL_PATH,
    CKD_PREPROCESSOR_PATH,
    CKD_RFECV_PATH,
    ORIGINAL_FEATURE_NAMES_PATH,
    SELECTED_FEATURE_INDICES_PATH,
)
from utils.data_handler import merge_with_defaults
from utils.validator import validate_input_data

prediction_bp = Blueprint("prediction_bp", __name__)

# Cache for loaded artifacts
_model_cache = None
# Track if we've applied the SHAP patch
_shap_patched = False


def _apply_deep_shap_xgboost_fix():
    """
    Apply deep monkey-patch to SHAP to handle XGBoost 2.0+ base_score format.
    This patches the JSON parsing layer where SHAP reads model config.
    """
    global _shap_patched
    
    if _shap_patched:
        return
    
    try:
        import shap
        import shap.explainers._tree as tree_module
        
        # Get the XGBTreeModelLoader class
        XGBTreeModelLoader = tree_module.XGBTreeModelLoader
        
        # Store original __init__
        original_init = XGBTreeModelLoader.__init__
        
        def patched_init(self, xgb_model):
            """
            Patched init that fixes XGBoost 2.0+ config format issues.
            This runs BEFORE SHAP tries to parse any model parameters.
            """
            # First, fix the model's internal config
            if hasattr(xgb_model, 'get_booster'):
                try:
                    booster = xgb_model.get_booster()
                    
                    # Get current config as string
                    config_str = booster.save_config()
                    
                    # Parse JSON
                    config_dict = json.loads(config_str)
                    
                    # Fix all bracket-notation parameters in learner_model_param
                    if 'learner' in config_dict:
                        if 'learner_model_param' in config_dict['learner']:
                            params = config_dict['learner']['learner_model_param']
                            
                            for key, value in list(params.items()):
                                if isinstance(value, str):
                                    # Fix bracket notation like '[5E-1]', '[0.5]', etc.
                                    if value.startswith('[') and value.endswith(']'):
                                        try:
                                            # Extract the number
                                            num_str = value.strip('[]').strip()
                                            
                                            # Handle scientific notation (E, e, D, d)
                                            num_str = re.sub(
                                                r'([0-9.]+)[EeDd]([+-]?[0-9]+)', 
                                                r'\1e\2', 
                                                num_str
                                            )
                                            
                                            # Convert to float then to string (clean format)
                                            fixed_value = str(float(num_str))
                                            params[key] = fixed_value
                                            
                                        except (ValueError, TypeError):
                                            # If parsing fails, leave as-is
                                            pass
                            
                            # Save the fixed config back to booster
                            fixed_config_str = json.dumps(config_dict, separators=(',', ':'))
                            booster.load_config(fixed_config_str)
                            
                except Exception as fix_error:
                    # If fix fails, we'll try the original init anyway
                    # It might fail, but at least we tried
                    current_app.logger.warning(f"Config fix failed: {fix_error}")
            
            # Now call original init with (hopefully) fixed model
            try:
                original_init(self, xgb_model)
            except (ValueError, TypeError) as e:
                error_str = str(e)
                # If it's still the base_score error, provide helpful message
                if 'could not convert string to float' in error_str and (
                    'base_score' in error_str or '[5E-1]' in error_str
                ):
                    # Get SHAP version safely
                    shap_version = getattr(shap, '__version__', 'unknown')
                    raise ValueError(
                        f"XGBoost 2.0+ model format incompatible with SHAP {shap_version}. "
                        f"Solutions: (1) Downgrade XGBoost to 1.7.6, or (2) Upgrade SHAP, or "
                        f"(3) Retrain model with XGBoost < 2.0. Original error: {e}"
                    )
                raise
        
        # Apply the monkey patch permanently
        XGBTreeModelLoader.__init__ = patched_init
        _shap_patched = True
        
        current_app.logger.info("✅ Applied deep SHAP-XGBoost compatibility patch")
        
    except Exception as e:
        current_app.logger.error(f"❌ Failed to apply SHAP patch: {e}")
        raise


def _load_artifacts():
    """Lazy-load artifacts matching the new ML training code structure."""
    global _model_cache
    
    if _model_cache is not None:
        return _model_cache
    
    try:
        # Load the final trained model
        model = joblib.load(CKD_MODEL_PATH)
        # Load preprocessor
        preprocessor = joblib.load(CKD_PREPROCESSOR_PATH)
        # Load RFECV selector
        rfecv = joblib.load(CKD_RFECV_PATH)
        # Load original feature names (BEFORE preprocessing)
        original_feature_names = joblib.load(ORIGINAL_FEATURE_NAMES_PATH)
        # Load selected feature indices
        selected_feature_indices = joblib.load(SELECTED_FEATURE_INDICES_PATH)
        
        _model_cache = (model, preprocessor, rfecv, original_feature_names, selected_feature_indices)
        return _model_cache
    except FileNotFoundError as e:
        current_app.logger.error(f"Model file not found: {e}")
        raise
    except Exception as e:
        current_app.logger.error(f"Error loading model artifacts: {e}")
        raise


def _predict_single(payload: dict):
    """
    Predict CKD probability using the trained model.
    """
    # Load artifacts (cached after first load)
    model, preprocessor, rfecv, original_feature_names, selected_feature_indices = _load_artifacts()
    
    # Merge with defaults for missing fields
    merged = merge_with_defaults(payload, extracted_data={})
    validated = validate_input_data(merged)
    
    from utils.validator import load_defaults
    defaults = load_defaults()
    
    # Create DataFrame from validated data
    patient_df = pd.DataFrame([validated])
    
    # Ensure same order as training - align with original feature names
    for col in original_feature_names:
        if col not in patient_df.columns:
            if col in defaults:
                patient_df[col] = defaults[col]
            else:
                patient_df[col] = np.nan
    
    # Reorder to match original feature order
    patient_df = patient_df[original_feature_names]
    
    # Select only RFECV-selected features
    if isinstance(selected_feature_indices, np.ndarray):
        indices = selected_feature_indices.tolist()
    else:
        indices = list(selected_feature_indices)
    
    patient_reduced = patient_df.iloc[:, indices]

    # Predict using the final model
    pred_prob = model.predict_proba(patient_reduced)[0][1]

    return float(pred_prob), patient_reduced, model


def _calculate_shap_values(model, patient_reduced):
    """
    Calculate SHAP values for a single patient prediction.
    """
    try:
        current_app.logger.info("Starting SHAP calculation...")
        
        # Validate input
        if patient_reduced is None or patient_reduced.empty:
            raise ValueError("patient_reduced is None or empty")
        
        if not isinstance(patient_reduced, pd.DataFrame):
            raise ValueError(f"patient_reduced must be a DataFrame, got {type(patient_reduced)}")
        
        current_app.logger.info(f"Patient data shape: {patient_reduced.shape}")
        
        # Import shap here (after patch is applied)
        import shap
        
        # Apply the deep patch (only runs once)
        _apply_deep_shap_xgboost_fix()
        
        # Create SHAP explainer
        current_app.logger.info("Creating SHAP TreeExplainer...")
        explainer = shap.TreeExplainer(model)
        current_app.logger.info("✅ SHAP explainer created successfully")
        
        # Convert to numpy array
        feature_array = patient_reduced.values
        
        # Calculate SHAP values
        current_app.logger.info("Calculating SHAP values...")
        shap_values = explainer.shap_values(feature_array)
        
        # Handle binary classification output
        if isinstance(shap_values, list) and len(shap_values) == 2:
            # Use positive class (index 1)
            shap_values = shap_values[1]
            current_app.logger.info("Using positive class SHAP values")
        elif isinstance(shap_values, list):
            shap_values = shap_values[0]
        
        # Ensure 2D shape
        if len(shap_values.shape) == 1:
            shap_values = shap_values.reshape(1, -1)
        elif len(shap_values.shape) == 3:
            shap_values = shap_values[0, :, 1].reshape(1, -1)
        
        current_app.logger.info(f"✅ SHAP values shape: {shap_values.shape}")
        
        # Get SHAP values for the single patient
        patient_shap = shap_values[0]
        patient_row = patient_reduced.iloc[0].to_dict()
        
        # Build explanations
        shap_explanations = []
        for i, feature_name in enumerate(patient_reduced.columns):
            impact_value = float(patient_shap[i])
            raw_value = patient_row.get(feature_name)
            
            # Format display value
            if isinstance(raw_value, (np.generic,)):
                display_value = raw_value.item()
            elif isinstance(raw_value, (np.ndarray, list)):
                display_value = raw_value[0] if len(raw_value) > 0 else None
            elif raw_value is None or pd.isna(raw_value):
                display_value = None
            else:
                try:
                    display_value = float(raw_value)
                except (TypeError, ValueError):
                    display_value = str(raw_value)
            
            shap_explanations.append({
                "feature": str(feature_name),
                "value": display_value,
                "impact": round(impact_value, 4),
            })
        
        # Sort by absolute impact
        shap_explanations.sort(key=lambda x: abs(x['impact']), reverse=True)
        
        # Top 10 with metadata
        top_10 = []
        for rank, factor in enumerate(shap_explanations[:10], start=1):
            top_10.append({
                "rank": rank,
                "feature": factor["feature"],
                "impact": factor["impact"],
                "abs_impact": round(abs(factor["impact"]), 4),
                "direction": "increases risk" if factor["impact"] > 0 else "decreases risk",
                "value": factor["value"],
            })
        
        # Expected value
        expected_val = explainer.expected_value
        if isinstance(expected_val, (list, np.ndarray)):
            expected_val = expected_val[1] if len(expected_val) == 2 else expected_val[0]
        expected_val = float(expected_val)
        
        current_app.logger.info(f"✅ SHAP complete: {len(top_10)} explanations")
        if top_10:
            current_app.logger.info(f"Top: {top_10[0]['feature']} = {top_10[0]['impact']}")
        
        return top_10, expected_val, None
        
    except Exception as e:
        error_msg = f"Error calculating SHAP values: {str(e)}"
        current_app.logger.error(error_msg)
        import traceback
        current_app.logger.error(traceback.format_exc())
        return [], None, error_msg


@prediction_bp.route("/test-shap", methods=["GET"])
def test_shap():
    """Test endpoint to verify SHAP is working."""
    try:
        import shap
        
        model, _, _, _, _ = _load_artifacts()
        
        # Apply patch
        _apply_deep_shap_xgboost_fix()
        
        # Try creating explainer
        explainer = shap.TreeExplainer(model)
        
        return jsonify({
            "status": "success",
            "message": "✅ SHAP explainer works!",
            "shap_version": shap.__version__,
            "xgboost_version": model.__class__.__module__,
            "patch_applied": _shap_patched
        })
    except Exception as e:
        import traceback
        return jsonify({
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500


@prediction_bp.route("/predict", methods=["POST", "OPTIONS"])
def predict_from_payload():
    """Accept JSON payload and return CKD probability with SHAP explanations."""
    
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

        probability, patient_reduced, model = _predict_single(data)
        prediction_percent = round(probability * 100, 2)
        
        # Calculate SHAP
        shap_explanations, expected_value, shap_error = _calculate_shap_values(model, patient_reduced)
        
        current_app.logger.info(f"Prediction: {prediction_percent}%, SHAP count: {len(shap_explanations)}")
        
        # Calculate feature statistics and generate suggestions
        feature_stats = _get_feature_stats()
        suggestions = _generate_suggestions(shap_explanations, data, feature_stats)
        
        response = {
            "status": "success",
            "prediction_percent": prediction_percent,
            "prediction_probability": round(probability, 4),
            "shap_explanations": shap_explanations,
            "suggestions": suggestions,
            "feature_stats": feature_stats
        }
        
        if expected_value is not None:
            response["shap_expected_value"] = round(expected_value, 4)
        
        if not shap_explanations:
            response["shap_warning"] = "SHAP calculation returned no results."
            if shap_error:
                response["shap_error"] = str(shap_error)
        
        return jsonify(response)
        
    except KeyError as exc:
        error_msg = str(exc)
        current_app.logger.error(f"KeyError: {error_msg}")
        if "[" in error_msg and "]" in error_msg:
            return jsonify({
                "status": "error", 
                "message": f"Column alignment error: {error_msg}"
            }), 400
        raise
        
    except Exception as exc:
        current_app.logger.exception("Prediction error: %s", exc)
        error_msg = str(exc)
        if "columns are missing" in error_msg.lower() or "not in index" in error_msg.lower():
            return jsonify({
                "status": "error",
                "message": f"Column mismatch: {error_msg}"
            }), 400
        return jsonify({"status": "error", "message": error_msg}), 500

# ==========================================
# Feature Statistics & Suggestions Logic
# ==========================================

_feature_stats_cache = None

def _get_feature_stats():
    """
    Load dataset and calculate min, q1, median, q3, max for all features.
    Cached after first run.
    """
    global _feature_stats_cache
    if _feature_stats_cache is not None:
        return _feature_stats_cache
        
    try:
        # Path to dataset - adjust if needed based on your structure
        dataset_path = "dataset/Chronic_Kidney_Dsease_data.csv"
        if not os.path.exists(dataset_path):
            current_app.logger.warning(f"Dataset not found at {dataset_path}, stats will be unavailable.")
            return {}
            
        df = pd.read_csv(dataset_path)
        
        # Clean target like in training
        target_col = "Diagnosis"
        if target_col in df.columns:
            df = df.drop(columns=[target_col])
        if 'PatientID' in df.columns:
            df = df.drop(columns=['PatientID'])
            
        stats = {}
        for col in df.select_dtypes(include=[np.number]).columns:
            desc = df[col].describe()
            stats[col] = {
                "min": float(desc["min"]),
                "q1": float(desc["25%"]),
                "median": float(desc["50%"]),
                "q3": float(desc["75%"]),
                "max": float(desc["max"])
            }
        
        _feature_stats_cache = stats
        current_app.logger.info(f"✅ Calculated stats for {len(stats)} features")
        return stats
        
    except Exception as e:
        current_app.logger.error(f"Failed to calculate feature stats: {e}")
        return {}

def _generate_suggestions(shap_explanations, patient_data, stats):
    """
    Generate actionable suggestions based on SHAP impact and population stats.
    """
    suggestions = []
    
    for item in shap_explanations:
        feature = item['feature']
        impact = item['impact']
        value = item['value']
        
        # Skip if we don't have stats or value
        if feature not in stats or value is None:
            continue
            
        feat_stats = stats[feature]
        median = feat_stats['median']
        
        # Logic:
        # If Impact > 0 (Increases Risk):
        #   - If Value > Median -> "High {feature} is increasing risk. Try to lower it."
        #   - If Value < Median -> "Low {feature} is increasing risk. Try to increase it."
        # If Impact < 0 (Decreases Risk):
        #   - "Good job! Your {feature} levels are helping reduce risk."
        
        if impact > 0:
            if value > median:
                msg = f"High **{feature}** ({value}) is increasing your risk. Aim to reduce it towards {median}."
                action = "reduce"
            else:
                msg = f"Low **{feature}** ({value}) is increasing your risk. Aim to increase it towards {median}."
                action = "increase"
            
            suggestions.append({
                "feature": feature,
                "message": msg,
                "action": action,
                "current_value": value,
                "target_value": median
            })
            
    return suggestions