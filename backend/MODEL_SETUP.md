# Model Setup Instructions

## Required Model Files

After running `train_model.py`, the following files will be created in `backend/models/`:

1. **ckd_prediction_pipeline.pkl** - The trained XGBoost model
2. **ckd_preprocessor.pkl** - The preprocessing pipeline (imputation + encoding)
3. **ckd_rfecv.pkl** - The RFECV feature selector
4. **original_feature_names.pkl** - List of original feature names (BEFORE preprocessing)
5. **selected_feature_indices.pkl** - Array of feature indices selected by RFECV
6. **selected_feature_names.pkl** - List of selected feature names

## Generating Model Files

Run the training script to automatically generate all required files:

```bash
cd backend
python train_model.py dataset/Chronic_Kidney_Dsease_data.csv
```

This will create all 6 files in `backend/models/` directory automatically.

## File Structure

```
backend/
├── models/
│   ├── ckd_prediction_pipeline.pkl
│   ├── original_feature_names.pkl
│   └── selected_feature_indices.pkl
├── routes/
│   └── prediction_routes.py
└── ...
```

## Testing

Once the model files are in place, the backend will automatically load them on startup. The prediction endpoint `/api/predict` will use these files to make predictions.

