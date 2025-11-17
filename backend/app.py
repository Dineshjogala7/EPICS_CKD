from flask import Flask
from flask_cors import CORS
from routes.prediction_routes import prediction_bp

app = Flask(__name__)

# Explicit CORS configuration for your Vercel domain
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://epics-ckd.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5000"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Register routes
app.register_blueprint(prediction_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "CKD Prediction API active", "status": "ok"}

@app.route("/health")
def health():
    return {"status": "healthy"}, 200

@app.route("/healthz")
def healthz():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
