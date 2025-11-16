import os
import logging

# -------------------------------
# 🧭 BASE PATHS
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
LOG_DIR = os.path.join(BASE_DIR, "logs")

# -------------------------------
# 🧠 MODEL FILES (Updated to match new ML training code)
# -------------------------------
CKD_MODEL_PATH = os.path.join(MODEL_DIR, "ckd_prediction_pipeline.pkl")
CKD_PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "ckd_preprocessor.pkl")
CKD_RFECV_PATH = os.path.join(MODEL_DIR, "ckd_rfecv.pkl")
ORIGINAL_FEATURE_NAMES_PATH = os.path.join(MODEL_DIR, "original_feature_names.pkl")
SELECTED_FEATURE_INDICES_PATH = os.path.join(MODEL_DIR, "selected_feature_indices.pkl")
SELECTED_FEATURE_NAMES_PATH = os.path.join(MODEL_DIR, "selected_feature_names.pkl")

# Legacy paths (for backward compatibility)
CKD_PIPELINE_PATH = CKD_MODEL_PATH

# Legacy paths (for backward compatibility)
XGBOOST_MODEL_PATH = os.path.join(MODEL_DIR, "xgboost_model.pkl")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.pkl")
FEATURE_SELECTOR_PATH = os.path.join(MODEL_DIR, "feature_selector.pkl")

# -------------------------------
# 🧩 DEFAULTS + SAMPLE DATA
# -------------------------------
DEFAULTS_JSON = os.path.join(DATA_DIR, "defaults.json")
SAMPLE_INPUT_JSON = os.path.join(DATA_DIR, "sample_inputs.json")

# -------------------------------
# ⚙️ APP SETTINGS
# -------------------------------
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

# -------------------------------
# 🪵 LOGGING CONFIGURATION
# -------------------------------
LOG_FILE = os.path.join(LOG_DIR, "app.log")

os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# -------------------------------
# 🚀 FUNCTION HELPERS
# -------------------------------
def allowed_file(filename):
    """Check if uploaded file is allowed (PDF only)."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
