from flask import Flask
from flask_cors import CORS

from routes.prediction_routes import prediction_bp

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(prediction_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "CKD Prediction API active"}

if __name__ == "__main__":
    app.run(debug=True)
