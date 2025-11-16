# How to Train the Model

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment (if not already activated):**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Run the training script with your dataset:**
   ```bash
   python train_model.py dataset\Chronic_Kidney_Dsease_data.csv
   ```

   Or with full path:
   ```bash
   python train_model.py C:\back+front\EPICS\backend\dataset\Chronic_Kidney_Dsease_data.csv
   ```

## Your Specific Case

Since your dataset is at:
```
C:\back+front\EPICS\backend\dataset\Chronic_Kidney_Dsease_data.csv
```

**From the backend directory, run:**
```bash
python train_model.py dataset\Chronic_Kidney_Dsease_data.csv
```

Or use the relative path from backend:
```bash
python train_model.py ..\backend\dataset\Chronic_Kidney_Dsease_data.csv
```

## What Happens

The script will:
1. Load and preprocess your dataset
2. Split into train/test sets
3. Apply preprocessing (imputation, encoding)
4. Perform feature selection with RFECV
5. Train the XGBoost model
6. Save three files to `backend/models/`:
   - `ckd_prediction_pipeline.pkl`
   - `original_feature_names.pkl`
   - `selected_feature_indices.pkl`

## Expected Output

You should see:
```
🚀 Starting CKD Prediction Model Training
📊 Loading dataset...
Target distribution:
...
✅ Training completed successfully!
```

## Troubleshooting

### File not found error
- Make sure you're in the `backend` directory
- Check the file path is correct
- Use forward slashes or escaped backslashes in paths

### Import errors
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` if needed


