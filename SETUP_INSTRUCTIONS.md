# CKD Prediction System - Setup Instructions

## Overview

This project consists of a Flask backend and React frontend for predicting Chronic Kidney Disease (CKD) risk using an XGBoost model with RFECV feature selection.

## Backend Setup (Flask)

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Place Model Files

Copy your trained model files to `backend/models/`:

- `ckd_prediction_pipeline.pkl` - The trained pipeline
- `original_feature_names.pkl` - Original feature names
- `selected_feature_indices.pkl` - Selected feature indices from RFECV

These files should be generated from your ML training code:

```python
joblib.dump(ckd_pipeline, "ckd_prediction_pipeline.pkl")
joblib.dump(X_train.columns.tolist(), "original_feature_names.pkl")
joblib.dump(rfecv.get_support(indices=True), "selected_feature_indices.pkl")
```

### 3. Run Backend

```bash
cd backend
flask --app app run
# Or:
python app.py
```

The backend will run on `http://localhost:5000`

## Frontend Setup (React)

### 1. Install Dependencies

```bash
cd front
npm install
```

### 2. Configure API URL (Optional)

Create a `.env` file in the `front` directory:

```
VITE_API_URL=http://localhost:5000/api
```

If not set, it defaults to `http://localhost:5000/api`

### 3. Run Frontend

```bash
cd front
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### POST `/api/predict`

Accepts a JSON payload with patient data and returns CKD risk prediction.

**Request:**
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

## Default Values

If any field is missing from the request, the system uses default values from `backend/data/defaults.json`. These match the sample patient data you provided.

## Testing

1. Start the backend: `cd backend && flask --app app run`
2. Start the frontend: `cd front && npm run dev`
3. Open the frontend URL in your browser
4. Fill in the form or click "Load Sample Patient"
5. Click "Predict CKD Risk" to get the prediction percentage

## Project Structure

```
EPICS/
├── backend/
│   ├── models/          # Place your .pkl files here
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── data/            # Default values
│   └── app.py           # Flask application
├── front/
│   ├── src/
│   │   ├── components/  # React components
│   │   └── constants/   # Field definitions
│   └── package.json
└── SETUP_INSTRUCTIONS.md
```

