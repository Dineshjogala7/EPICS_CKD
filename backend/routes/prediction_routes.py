from __future__ import annotations

from flask import Blueprint, request, jsonify, current_app
import joblib
import pandas as pd
import numpy as np

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


def _predict_single(payload: dict) -> float:
    """
    Predict CKD probability using the trained model.
    Matches the Colab prediction flow exactly:
    1. Merge with defaults
    2. Validate input
    3. Create DataFrame and align with original feature names
    4. Select RFECV-selected features by indices (from original features)
    5. Pass directly to model (model expects selected original features)
    6. Return probability
    """
    # Load artifacts (cached after first load)
    model, preprocessor, rfecv, original_feature_names, selected_feature_indices = _load_artifacts()
    
    # Merge with defaults for missing fields
    merged = merge_with_defaults(payload, extracted_data={})
    validated = validate_input_data(merged)

    # Match the Colab prediction flow exactly:
    # 1. Align with original features
    # 2. Select RFECV-selected features from original features
    # 3. Pass directly to model (model expects selected original features)
    
    from utils.validator import load_defaults
    defaults = load_defaults()
    
    # Create DataFrame from validated data
    patient_df = pd.DataFrame([validated])
    
    # Ensure same order as training - align with original feature names
    # Fill missing columns with NaN (matching Colab code)
    for col in original_feature_names:
        if col not in patient_df.columns:
            # Try to get from defaults first
            if col in defaults:
                patient_df[col] = defaults[col]
            else:
                patient_df[col] = np.nan
    
    # Reorder to match original feature order
    patient_df = patient_df[original_feature_names]
    
    # Select only RFECV-selected features (from original features)
    # Handle both list and numpy array formats
    if isinstance(selected_feature_indices, np.ndarray):
        indices = selected_feature_indices.tolist()
    else:
        indices = list(selected_feature_indices)
    
    patient_reduced = patient_df.iloc[:, indices]

    # Predict using the final model (matches Colab code exactly)
    pred_prob = model.predict_proba(patient_reduced)[0][1]

    return float(pred_prob)


@prediction_bp.route("/predict", methods=["POST"])
def predict_from_payload():
    """Accept JSON payload and return CKD probability."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

        probability = _predict_single(data)
        prediction_percent = round(probability * 100, 2)
        
        return jsonify(
            {
                "status": "success",
                "prediction_percent": prediction_percent,
                "prediction_probability": round(probability, 4),
            }
        )
    except KeyError as exc:
        # Handle missing columns error
        error_msg = str(exc)
        current_app.logger.error(f"KeyError in prediction: {error_msg}")
        # Try to extract missing column names from error
        if "[" in error_msg and "]" in error_msg:
            # This is likely a pandas KeyError with column names
            return jsonify({
                "status": "error", 
                "message": f"Column alignment error. Please ensure all required fields are provided. Error: {error_msg}"
            }), 400
        raise
    except Exception as exc:  # pylint: disable=broad-except
        current_app.logger.exception("❌ Prediction error from payload: %s", exc)
        error_msg = str(exc)
        # Check if it's a column-related error
        if "columns are missing" in error_msg.lower() or "not in index" in error_msg.lower():
            return jsonify({
                "status": "error",
                "message": f"Column mismatch detected. The model expects certain columns that are missing. Error: {error_msg}"
            }), 400
        return jsonify({"status": "error", "message": error_msg}), 500
