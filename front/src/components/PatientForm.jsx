import { useMemo, useState } from "react";
import axios from "axios";

const numberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
};

function buildInitialState(sections, overrides = {}) {
  return sections.reduce((acc, section) => {
    section.items.forEach((item) => {
      const defaultValue = overrides[item.name] ?? "";
      acc[item.name] = numberOrNull(defaultValue);
    });
    return acc;
  }, {});
}

function PatientForm({ fields, sampleValues, apiBaseUrl }) {
  const initialState = useMemo(
    () => buildInitialState(fields, sampleValues),
    [fields, sampleValues],
  );

  const [formValues, setFormValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (name, type) => (event) => {
    const { value } = event.target;
    const nextValue = type === "number" || type === "range" ? numberOrNull(value) : value;
    setFormValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    setPrediction(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(formValues).map(([key, value]) => {
          if (value === "") {
            return [key, null];
          }
          return [key, typeof value === "string" ? Number(value) : value];
        }),
      );

      const { data } = await axios.post(`${apiBaseUrl}/predict`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.status === "success") {
        setPrediction({
          percentage: data.prediction_percent,
          probability: data.prediction_probability,
        });
      } else {
        setApiError(data.message || "Unable to compute prediction.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred while calling the API.";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormValues(buildInitialState(fields));
    setPrediction(null);
    setApiError(null);
  };

  const handleUseSample = () => {
    setFormValues(initialState);
    setPrediction(null);
    setApiError(null);
  };

  return (
    <section className="card">
      <form onSubmit={handleSubmit} className="patient-form">
        {fields.map((group) => (
          <fieldset key={group.section}>
            <legend>{group.section}</legend>
            <div className="field-grid">
              {group.items.map((field) => (
                <label key={field.name} htmlFor={field.name} className="field">
                  <span className="field-label">{field.label}</span>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      value={formValues[field.name]}
                      onChange={handleInputChange(field.name, field.type)}
                    >
                      <option value="">Select…</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step ?? 1}
                      value={formValues[field.name]}
                      onChange={handleInputChange(field.name, field.type)}
                      placeholder="Enter value"
                      inputMode="decimal"
                      required
                    />
                  )}
                  {field.helper && <small className="field-helper">{field.helper}</small>}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Predicting…" : "Predict CKD Risk"}
          </button>
          <button type="button" onClick={handleUseSample} disabled={isSubmitting}>
            Load Sample Patient
          </button>
          <button type="button" onClick={handleReset} disabled={isSubmitting}>
            Reset Form
          </button>
        </div>
      </form>

      <div className="result-panel">
        {prediction && (
          <div className="result success">
            <h3>Prediction</h3>
            <p>
              CKD probability: <strong>{prediction.percentage}%</strong>
            </p>
            <p className="muted">Raw probability: {prediction.probability.toFixed(4)}</p>
          </div>
        )}

        {apiError && (
          <div className="result error">
            <h3>API Error</h3>
            <p>{apiError}</p>
          </div>
        )}

        {!prediction && !apiError && (
          <div className="result info">
            <h3>Instructions</h3>
            <p>
              Complete each field using patient data or load the pre-filled sample, then press
              "Predict CKD Risk" to send the payload to the Flask backend.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default PatientForm;

