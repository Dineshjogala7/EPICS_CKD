import { useMemo } from "react";

import PatientForm from "./components/PatientForm.jsx";
import { PATIENT_FIELDS, SAMPLE_PATIENT } from "./constants/patientFields.js";

function App() {
  const apiBaseUrl = useMemo(() => {
    return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  }, []);

  return (
    <main className="app-container">
      <header>
        <h1>Chronic Kidney Disease Risk Estimator</h1>
        <p>
          Enter patient demographics, lifestyle metrics, vitals, and lab results
          to generate a CKD risk prediction using the trained XGBoost model.
        </p>
      </header>

      <PatientForm
        fields={PATIENT_FIELDS}
        sampleValues={SAMPLE_PATIENT}
        apiBaseUrl={apiBaseUrl}
      />

      <footer>
        <p>
          Backend: Flask · Frontend: React · Model: XGBoost with RFECV feature
          selection
        </p>
      </footer>
    </main>
  );
}

export default App;

