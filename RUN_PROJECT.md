# How to Run the CKD Prediction Project

Complete step-by-step guide to run the entire project.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Your training dataset CSV file

## Step 1: Train the Model (Backend)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Train the model:**
   ```bash
   python train_model.py path/to/your/dataset.csv
   ```
   
   Replace `path/to/your/dataset.csv` with the actual path to your training CSV file.
   
   This will create three files in `backend/models/`:
   - `ckd_prediction_pipeline.pkl`
   - `original_feature_names.pkl`
   - `selected_feature_indices.pkl`

## Step 2: Start the Backend API

1. **Make sure you're in the backend directory with venv activated**

2. **Run the Flask server:**
   ```bash
   python app.py
   ```
   
   Or:
   ```bash
   flask --app app run
   ```

3. **Verify it's running:**
   - Open browser: `http://localhost:5000`
   - You should see: `{"message": "CKD Prediction API active"}`

## Step 3: Start the Frontend

1. **Open a new terminal window**

2. **Navigate to frontend directory:**
   ```bash
   cd front
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)
   - Check the terminal output for the exact URL

## Step 4: Use the Application

1. **Open the frontend URL in your browser**

2. **Fill in the patient form** with all required fields, or click "Load Sample Patient" to use default values

3. **Click "Predict CKD Risk"** to get the prediction

4. **View the result** - The CKD risk percentage will be displayed

## Troubleshooting

### Model files not found
- Make sure you've run `train_model.py` successfully
- Check that all three `.pkl` files exist in `backend/models/`

### Backend won't start
- Ensure virtual environment is activated
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify Python version is 3.8+

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check `front/.env` file (create if needed) and set:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

### CORS errors
- Make sure `flask-cors` is installed in the backend
- Verify the backend is running before starting the frontend

## Project Structure

```
EPICS/
├── backend/              # Flask API
│   ├── app.py           # Main Flask app
│   ├── train_model.py   # Model training script
│   ├── models/          # Trained models (generated)
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
├── front/               # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   └── package.json
└── RUN_PROJECT.md       # This file
```

## Quick Commands Summary

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python train_model.py dataset.csv
python app.py
```

**Frontend:**
```bash
cd front
npm install
npm run dev
```

