import json
from pathlib import Path

from config import DEFAULTS_JSON


def merge_with_defaults(user_data, extracted_data, defaults_path=DEFAULTS_JSON):
    with Path(defaults_path).open("r", encoding="utf-8") as f:
        defaults = json.load(f)

    merged = defaults.copy()
    merged.update(user_data or {})
    merged.update(extracted_data or {})

    return merged
