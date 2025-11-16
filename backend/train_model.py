"""
CKD Prediction Model Training Script
Updated to match the new ML pipeline with RFECV on balanced data.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)
from sklearn.feature_selection import RFECV
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib
import os

# Import config to get model directory
from config import MODEL_DIR

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)


def train_model(csv_path):
    """Main training function matching the new ML pipeline."""
    print("=" * 60)
    print("🚀 Starting CKD Prediction Model Training")
    print("=" * 60)
    
    # ================================
    # Load dataset
    # ================================
    print("\n📊 Loading dataset...")
    df = pd.read_csv(csv_path)
    
    # ================================
    # TARGET COLUMN CLEANING
    # ================================
    target_col = "Diagnosis"
    df[target_col] = df[target_col].astype(str).str.lower().str.strip()
    df[target_col] = df[target_col].map({
        "ckd": 1,
        "chronic_kidney_disease": 1,
        "yes": 1,
        "1": 1,
        "true": 1,
        "non-ckd": 0,
        "no": 0,
        "0": 0,
        "false": 0
    })
    
    # Remove unmapped rows
    df = df.dropna(subset=[target_col])
    df[target_col] = df[target_col].astype(int)
    
    print(f"Target distribution:\n{df[target_col].value_counts()}")
    print("✅ Dataset Loaded & Target Cleaned Successfully!")
    
    # Drop PatientID if present
    df = df.drop(columns=['PatientID'], errors='ignore')
    
    # Separate features and target
    y = df[target_col]
    X = df.drop(columns=[target_col])
    
    # ================================
    # Train/Test Split
    # ================================
    print("\n📦 Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # ================================
    # IMPORTANT: Store original feature names BEFORE preprocessing
    # ================================
    original_feature_names = list(X.columns)
    print(f"\n📋 Original feature count: {len(original_feature_names)}")
    
    # ================================
    # Create Preprocessor
    # ================================
    print("\n🔧 Creating preprocessor...")
    numeric_cols = X_train.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = [c for c in X_train.columns if c not in numeric_cols]
    
    numeric_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="median"))
    ])
    
    categorical_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ])
    
    preprocessor = ColumnTransformer([
        ("num", numeric_transformer, numeric_cols),
        ("cat", categorical_transformer, categorical_cols)
    ])
    
    # Fit and transform
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    
    # Get feature names after preprocessing (for reference)
    ohe = preprocessor.named_transformers_['cat']['onehot']
    cat_features = ohe.get_feature_names_out(categorical_cols).tolist()
    processed_feature_names = numeric_cols + cat_features
    print(f"✅ Processed feature count: {len(processed_feature_names)}")
    
    # ================================
    # Apply SMOTE
    # ================================
    print("\n⚖️ Applying SMOTE for balanced training...")
    sm = SMOTE(random_state=42)
    X_train_bal, y_train_bal = sm.fit_resample(X_train_proc, y_train)
    print(f"Before SMOTE: {sum(y_train==1)} positive, {sum(y_train==0)} negative")
    print(f"After SMOTE: {sum(y_train_bal==1)} positive, {sum(y_train_bal==0)} negative")
    
    # ================================
    # Feature Selection using RFECV (on balanced data)
    # ================================
    print("\n🔍 Performing feature selection with RFECV...")
    xgb_base = XGBClassifier(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=3,
        eval_metric='logloss',
        random_state=42
    )
    
    rfecv = RFECV(
        estimator=xgb_base,
        step=1,
        cv=StratifiedKFold(5),
        scoring='roc_auc',
        n_jobs=-1
    )
    
    # Fit RFECV on balanced training data
    rfecv.fit(X_train_bal, y_train_bal)
    
    # Get selected feature indices
    selected_feature_indices = np.where(rfecv.support_ == True)[0]
    selected_feature_names = [original_feature_names[i] for i in selected_feature_indices]
    
    print(f"✅ Selected {len(selected_feature_indices)} features out of {X_train_proc.shape[1]}")
    print(f"Selected features: {selected_feature_names[:10]}..." if len(selected_feature_names) > 10 else f"Selected features: {selected_feature_names}")
    
    # Transform datasets using selected features
    X_train_sel = rfecv.transform(X_train_bal)
    X_test_sel = rfecv.transform(X_test_proc)
    
    # ================================
    # Train Final Model
    # ================================
    print("\n🎯 Training final XGBoost model...")
    final_model = XGBClassifier(
        n_estimators=400,
        learning_rate=0.05,
        max_depth=5,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_lambda=2,
        eval_metric="auc",
        random_state=42
    )
    
    final_model.fit(X_train_sel, y_train_bal)
    
    # ================================
    # Evaluate
    # ================================
    print("\n📈 Evaluating model...")
    pred_final = final_model.predict(X_test_sel)
    prob_final = final_model.predict_proba(X_test_sel)[:, 1]
    
    print(f"✅ Final Accuracy: {accuracy_score(y_test, pred_final):.4f}")
    print(f"✅ Final ROC-AUC: {roc_auc_score(y_test, prob_final):.4f}")
    print(f"\nConfusion Matrix:\n{confusion_matrix(y_test, pred_final)}")
    print(f"\nClassification Report:\n{classification_report(y_test, pred_final)}")
    
    # ================================
    # Save All Artifacts
    # ================================
    print("\n💾 Saving model artifacts...")
    
    # Save paths
    model_path = os.path.join(MODEL_DIR, "ckd_prediction_pipeline.pkl")
    preprocessor_path = os.path.join(MODEL_DIR, "ckd_preprocessor.pkl")
    rfecv_path = os.path.join(MODEL_DIR, "ckd_rfecv.pkl")
    original_features_path = os.path.join(MODEL_DIR, "original_feature_names.pkl")
    selected_indices_path = os.path.join(MODEL_DIR, "selected_feature_indices.pkl")
    selected_names_path = os.path.join(MODEL_DIR, "selected_feature_names.pkl")
    
    # Save files
    joblib.dump(final_model, model_path)
    joblib.dump(preprocessor, preprocessor_path)
    joblib.dump(rfecv, rfecv_path)
    joblib.dump(original_feature_names, original_features_path)
    joblib.dump(selected_feature_indices, selected_indices_path)
    joblib.dump(selected_feature_names, selected_names_path)
    
    print(f"✅ Final model saved: {model_path}")
    print(f"✅ Preprocessor saved: {preprocessor_path}")
    print(f"✅ RFECV saved: {rfecv_path}")
    print(f"✅ Original feature names saved: {original_features_path}")
    print(f"✅ Selected feature indices saved: {selected_indices_path}")
    print(f"✅ Selected feature names saved: {selected_names_path}")
    
    print("\n" + "=" * 60)
    print("🎉 Model saved successfully!")
    print("=" * 60)
    
    return final_model, preprocessor, rfecv, original_feature_names, selected_feature_indices


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python train_model.py <path_to_csv_file>")
        print("\nExample:")
        print("  python train_model.py dataset/Chronic_Kidney_Dsease_data.csv")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    if not os.path.exists(csv_path):
        print(f"❌ Error: File not found: {csv_path}")
        sys.exit(1)
    
    try:
        train_model(csv_path)
    except Exception as e:
        print(f"\n❌ Error during training: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
