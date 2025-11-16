# Changelog - Model Update

## Updated Model Pipeline (Latest)

### Key Changes

1. **Feature Selection Approach**
   - RFECV is now fitted on **balanced (SMOTE) training data** instead of unbalanced data
   - Original feature names are stored **BEFORE preprocessing** (from `X.columns`)
   - Selected features are identified by indices from original features

2. **Model Artifacts**
   - **Separate files**: Model, preprocessor, and RFECV are saved separately
   - **New files**: `ckd_preprocessor.pkl`, `ckd_rfecv.pkl`, `selected_feature_names.pkl`
   - **Updated**: Model is now just XGBoost, not a Pipeline

3. **Prediction Flow**
   - Align with original feature names
   - Select features by indices from original DataFrame
   - Apply preprocessor (imputation + encoding)
   - Apply RFECV transform
   - Predict with final model

### Files Changed

- `train_model.py` - Complete rewrite to match new pipeline
- `routes/prediction_routes.py` - Updated prediction flow
- `config.py` - Added new model file paths
- `requirements.txt` - Added lightgbm and catboost (for future use)

### Training Command

```bash
python train_model.py dataset/Chronic_Kidney_Dsease_data.csv
```

### Model Files Generated

1. `ckd_prediction_pipeline.pkl` - Final XGBoost model
2. `ckd_preprocessor.pkl` - Preprocessing pipeline
3. `ckd_rfecv.pkl` - RFECV feature selector
4. `original_feature_names.pkl` - Original column names
5. `selected_feature_indices.pkl` - Selected feature indices
6. `selected_feature_names.pkl` - Selected feature names

