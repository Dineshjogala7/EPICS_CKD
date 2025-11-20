import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { formatBinaryValue } from "../constants/patientFields";
import BoxPlot from "./BoxPlot";


// Helper to get stats for a feature if available
// We need to fetch stats from backend or pass them. 
// Actually, the backend should return stats for the top features in the response.
// Let's assume the backend returns 'feature_stats' in the response or we can fetch them.
// Based on the plan, the backend returns 'suggestions' and we can probably include stats there or separately.
// Let's update the backend to return stats in the 'suggestions' or a separate field.
// The current backend code I wrote returns 'suggestions' which includes 'current_value' and 'target_value'.
// But for BoxPlot we need min, q1, median, q3, max.
// I should have added that to the backend response.
// Let's assume I will update the backend to return 'feature_stats' map in the response.


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

      // FIX: Changed from backticks to parentheses
      const { data } = await axios.post(`${apiBaseUrl}/predict`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.status === "success") {
        console.log("API Response:", data);
        console.log("SHAP Explanations:", data.shap_explanations);
        console.log("SHAP Warning:", data.shap_warning);
        console.log("SHAP Error:", data.shap_error);
        setPrediction({
          percentage: data.prediction_percent,
          probability: data.prediction_probability,
          shapExplanations: data.shap_explanations || [],
          shapExpectedValue: data.shap_expected_value,

          shapWarning: data.shap_warning,
          shapError: data.shap_error,
          suggestions: data.suggestions || [],
          featureStats: data.feature_stats || {} // We need to ensure backend sends this
        });
      } else {
        setApiError(data.message || "Unable to compute prediction.");
      }
    } catch (error) {
      console.error("API Error:", error); // Add logging for debugging
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

  const shapFactors = prediction?.shapExplanations || [];
  const maxAbsImpact =
    shapFactors.length > 0
      ? Math.max(
        1e-6,
        ...shapFactors.map((item) => Math.abs(item.abs_impact ?? item.impact ?? 0)),
      )
      : 1e-6;

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
                      step={field.step ?? "any"}
                      value={formValues[field.name]}
                      onChange={handleInputChange(field.name, field.type)}
                      placeholder="Enter value"
                      inputMode="decimal"
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

            {/* Debug: Show what we received */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                Debug: SHAP data received: {prediction.shapExplanations ? `${prediction.shapExplanations.length} items` : 'none'}
              </div>
            )}

            {prediction.shapExplanations && prediction.shapExplanations.length > 0 ? (
              <div className="shap-explanations">
                <h4>🔍 Top Factors Affecting This Patient's CKD Risk</h4>
                <p className="muted">
                  Positive values push the prediction toward CKD, negative values pull it away.
                </p>
                <ol className="shap-factor-list">
                  {shapFactors.map((factor) => {
                    const arrow = factor.impact > 0 ? "↑ increases risk" : "↓ decreases risk";
                    const formattedValue =
                      factor.value === null || factor.value === undefined
                        ? "N/A"
                        : formatBinaryValue(factor.value, factor.feature);
                    const widthPercent = Math.min(
                      100,
                      (Math.abs(factor.abs_impact ?? factor.impact ?? 0) / maxAbsImpact) * 100,
                    );

                    // Find suggestion for this feature
                    const suggestion = prediction.suggestions?.find(s => s.feature === factor.feature);
                    // Find stats for this feature (we need to add this to backend response)
                    // For now, let's check if suggestion has target_value (median) and we can try to infer or just show what we have.
                    // Wait, I need to update backend to return full stats for the boxplot.
                    // I will do that in the next step. For now let's wire up the UI.
                    const stats = prediction.featureStats?.[factor.feature];

                    return (
                      <li key={factor.feature} className="shap-factor">
                        <div className="shap-factor-header">
                          <span className="shap-factor-name">
                            {factor.rank}. {factor.feature}
                          </span>
                          <span
                            className={`shap-factor-impact ${factor.impact > 0 ? "positive" : "negative"
                              }`}
                          >
                            {factor.impact.toFixed(4)} → {arrow}
                          </span>
                        </div>
                        <div className="shap-factor-details">Value: {formattedValue}</div>

                        {/* Suggestion */}
                        {suggestion && (
                          <div className="shap-suggestion" style={{
                            backgroundColor: suggestion.action === 'reduce' ? '#f8d7da' : '#d1e7dd',
                            color: suggestion.action === 'reduce' ? '#721c24' : '#0f5132',
                            padding: '8px',
                            borderRadius: '4px',
                            marginTop: '5px',
                            fontSize: '0.9em'
                          }}>
                            <strong>💡 Suggestion:</strong> <span dangerouslySetInnerHTML={{ __html: suggestion.message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                          </div>
                        )}

                        {/* BoxPlot */}
                        {stats && (
                          <BoxPlot feature={factor.feature} value={factor.value} stats={stats} />
                        )}

                        <div
                          className={`shap-factor-bar ${factor.impact >= 0 ? "positive" : "negative"
                            }`}
                        >
                          <div
                            className="shap-factor-bar-fill"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ol>
                {prediction.shapExpectedValue && (
                  <p className="muted shap-expected">
                    Model baseline (expected value): {prediction.shapExpectedValue.toFixed(4)}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
                <p style={{ margin: 0, color: "#856404", fontWeight: "bold" }}>
                  ⚠️ SHAP explanations not available.
                </p>
                {prediction.shapError && (
                  <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "4px" }}>
                    <p style={{ margin: 0, color: "#721c24", fontSize: "0.9em" }}>
                      <strong>Error:</strong> {prediction.shapError}
                    </p>
                  </div>
                )}
                {prediction.shapWarning && !prediction.shapError && (
                  <p style={{ marginTop: "10px", margin: 0, color: "#856404", fontSize: "0.9em" }}>
                    {prediction.shapWarning}
                  </p>
                )}
                <p style={{ marginTop: "10px", margin: 0, color: "#856404", fontSize: "0.85em" }}>
                  Check browser console (F12) and backend terminal for more details.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <details style={{ marginTop: "10px" }}>
                    <summary style={{ cursor: "pointer", color: "#856404", fontSize: "0.85em" }}>Debug Info</summary>
                    <pre style={{ marginTop: "10px", fontSize: "0.8em", overflow: "auto", backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "4px" }}>
                      {JSON.stringify(prediction, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
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

