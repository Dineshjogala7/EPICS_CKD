import json
import logging
from pathlib import Path

from config import DEFAULTS_JSON

def load_defaults():
    """Load default values for missing patient/report fields."""
    try:
        with Path(DEFAULTS_JSON).open("r", encoding="utf-8") as f:
            defaults = json.load(f)
        return defaults
    except Exception as e:
        logging.error(f"❌ Error loading defaults.json: {e}")
        return {}

def validate_input_data(input_data: dict) -> dict:
    """
    Validates and cleans incoming merged patient + report data.
    1. Ensures all required fields exist (fills with defaults).
    2. Converts numeric fields to float.
    3. Standardizes boolean/text fields.
    """

    defaults = load_defaults()
    validated = {}

    # Merge with defaults: if field missing → use default
    for field, default_value in defaults.items():
        value = input_data.get(field, default_value)

        # Basic type normalization
        try:
            if isinstance(default_value, (int, float)):
                # Try convert to numeric
                if value is None or value == "":
                    value = default_value
                else:
                    value = float(value)
            elif isinstance(default_value, bool):
                if str(value).lower() in ['true', '1', 'yes']:
                    value = True
                else:
                    value = False
            elif isinstance(default_value, str):
                value = str(value).strip().lower()
        except Exception as e:
            logging.warning(f"⚠️ Could not convert field '{field}' value '{value}': {e}")
            value = default_value

        validated[field] = value

    # Add any extra fields present in input_data (that aren't in defaults)
    for extra_field in input_data.keys():
        if extra_field not in validated:
            validated[extra_field] = input_data[extra_field]

    logging.info(f"✅ Validation completed. Total fields: {len(validated)}")
    return validated
