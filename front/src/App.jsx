import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import PatientForm from "./components/PatientForm";
import { PATIENT_FIELDS, SAMPLE_PATIENT } from "./constants/patientFields.js";

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  return (
    <Router>
      <div className="app">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="main-content"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/predict"
              element={
                <div className="predict-page">
                  <div className="page-container">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="page-header"
                    >
                      <h1>Chronic Kidney Disease Risk Prediction</h1>
                      <p>
                        Enter patient demographics, lifestyle metrics, vitals, and lab
                        results to generate a CKD risk prediction using our trained
                        XGBoost model.
                      </p>
                    </motion.div>
                    <PatientForm
                      fields={PATIENT_FIELDS}
                      sampleValues={SAMPLE_PATIENT}
                      apiBaseUrl={apiBaseUrl}
                    />
                  </div>
                </div>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </motion.main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
