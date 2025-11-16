# CKD Prediction System

A complete web application for predicting Chronic Kidney Disease (CKD) risk using machine learning. Built with Flask (backend) and React (frontend), powered by XGBoost with RFECV feature selection.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- Your training dataset CSV file

### 1. Train the Model

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python train_model.py path/to/your/dataset.csv
```

This creates the model files in `backend/models/`.

### 2. Start Backend

```bash
cd backend
python app.py
```

Backend runs on `http://localhost:5000`

### 3. Start Frontend

```bash
cd front
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
EPICS/
├── backend/                    # Flask API
│   ├── app.py                 # Main Flask application
│   ├── train_model.py         # Model training script
│   ├── test_prediction.py     # API test script
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Trained models (generated)
│   │   ├── ckd_prediction_pipeline.pkl
│   │   ├── original_feature_names.pkl
│   │   └── selected_feature_indices.pkl
│   ├── routes/
│   │   └── prediction_routes.py
│   ├── utils/
│   │   ├── data_handler.py
│   │   └── validator.py
│   └── data/
│       └── defaults.json
├── front/                     # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── PatientForm.jsx
│   │   └── constants/
│   │       └── patientFields.js
│   └── package.json
├── README.md                  # This file
└── RUN_PROJECT.md             # Detailed setup guide
```

## 🎯 Features

- **Machine Learning Pipeline**: XGBoost with RFECV feature selection
- **RESTful API**: Flask backend with CORS support
- **Modern UI**: React frontend with form validation
- **Default Values**: Automatic handling of missing fields
- **Production Ready**: Pipeline includes imputation and scaling

## 📊 Model Details

- **Algorithm**: XGBoost Classifier
- **Feature Selection**: RFECV (Recursive Feature Elimination with Cross-Validation)
- **Preprocessing**: 
  - Numeric: Median imputation
  - Categorical: Most frequent imputation + One-Hot Encoding
- **Pipeline**: Imputer → StandardScaler → XGBoost

## 🔌 API Endpoints

### POST `/api/predict`

Predicts CKD risk from patient data.

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

## 🧪 Testing

Test the API after starting the backend:

```bash
cd backend
python test_prediction.py
```

## 📝 Documentation

- `RUN_PROJECT.md` - Detailed setup and running instructions
- `backend/README.md` - Backend-specific documentation
- `backend/MODEL_SETUP.md` - Model file setup guide

## 🛠️ Development

### Backend Development
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Development
```bash
cd front
npm install
npm run dev
```

## 📦 Dependencies

### Backend
- Flask 3.0.3
- XGBoost 2.0.3
- scikit-learn 1.3.2
- pandas 2.2.2
- numpy 1.26.4
- imbalanced-learn 0.11.0

### Frontend
- React 18.3.1
- Vite 5.4.2
- Axios 1.7.7

## ⚠️ Important Notes

1. **Model Files**: You must train the model first using `train_model.py` before running the API
2. **Default Values**: Missing fields are automatically filled from `backend/data/defaults.json`
3. **Feature Selection**: Only RFECV-selected features are used for prediction
4. **CORS**: Backend has CORS enabled for frontend communication

## 🐛 Troubleshooting

See `RUN_PROJECT.md` for detailed troubleshooting guide.

## 📄 License

This project is for educational/research purposes.

