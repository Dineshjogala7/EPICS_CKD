# CKD Prediction Backend

Flask API backend for Chronic Kidney Disease risk prediction using XGBoost.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Train the Model

Place your training CSV file in the backend directory, then run:

```bash
python train_model.py path/to/your/dataset.csv
```

This will create three files in `backend/models/`:
- `ckd_prediction_pipeline.pkl` - The trained model pipeline
- `original_feature_names.pkl` - Original feature column names
- `selected_feature_indices.pkl` - Selected feature indices from RFECV

### 3. Run the API

```bash
python app.py
```

Or using Flask CLI:
```bash
flask --app app run
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST `/api/predict`

Predicts CKD risk from patient data.

**Request Body:**
```json
{
  "Age": 68,
  "Gender": 0,
  "Ethnicity": 1,
  ...
}
```

**Response:**
```json
{
  "status": "success",
  "prediction_percent": 85.42,
  "prediction_probability": 0.8542
}
```

## Project Structure

```
backend/
├── app.py                 # Flask application entry point
├── config.py              # Configuration and paths
├── train_model.py         # Model training script
├── requirements.txt       # Python dependencies
├── models/                # Trained model files (generated)
│   ├── ckd_prediction_pipeline.pkl
│   ├── original_feature_names.pkl
│   └── selected_feature_indices.pkl
├── routes/
│   └── prediction_routes.py  # API prediction endpoints
├── utils/
│   ├── data_handler.py    # Data merging utilities
│   └── validator.py       # Input validation
└── data/
    └── defaults.json      # Default values for missing fields
```

## Notes

- Missing fields in the request will be filled with default values from `data/defaults.json`
- The model uses RFECV feature selection, so only selected features are used for prediction
- The pipeline handles imputation and scaling automatically

