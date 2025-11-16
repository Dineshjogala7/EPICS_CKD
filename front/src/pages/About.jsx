import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function About() {
  const stats = [
    { label: "Model Accuracy", value: "92.37%", icon: "🎯" },
    { label: "Features Analyzed", value: "44+", icon: "📊" },
    { label: "Prediction Speed", value: "< 1s", icon: "⚡" },
    { label: "Data Points", value: "50+", icon: "🔬" },
  ];

  const techStack = [
    { name: "XGBoost", description: "Gradient boosting framework" },
    { name: "RFECV", description: "Recursive feature elimination" },
    { name: "Flask", description: "Python web framework" },
    { name: "React", description: "Modern UI library" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="about-hero"
      >
        <h1>About CKD Predictor</h1>
        <p className="hero-subtitle">
          Advanced machine learning solution for Chronic Kidney Disease risk assessment
        </p>
      </motion.section>

      {/* Stats Section */}
      <section className="stats-section">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="stats-grid"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="stat-card"
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Model Accuracy Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="accuracy-section"
      >
        <div className="accuracy-card">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="accuracy-circle"
          >
            <span className="accuracy-value">92.37%</span>
            <span className="accuracy-label">Accuracy</span>
          </motion.div>
          <div className="accuracy-content">
            <h2>Model Performance</h2>
            <p>
              Our XGBoost-based model achieves <strong>92.37% accuracy</strong> in
              predicting Chronic Kidney Disease risk. The model uses Recursive Feature
              Elimination with Cross-Validation (RFECV) to select the most important
              features from over 50 clinical parameters.
            </p>
            <ul className="accuracy-features">
              <li>✓ Trained on comprehensive clinical datasets</li>
              <li>✓ Validated using stratified cross-validation</li>
              <li>✓ Optimized for both sensitivity and specificity</li>
              <li>✓ Real-time prediction capability</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Technology Stack */}
      <section className="tech-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>Technology Stack</h2>
          <p>Built with modern, reliable technologies</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="tech-grid"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              className="tech-card"
            >
              <h3>{tech.name}</h3>
              <p>{tech.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="how-it-works"
      >
        <h2>How It Works</h2>
        <div className="steps">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="step"
          >
            <div className="step-number">1</div>
            <h3>Enter Patient Data</h3>
            <p>Input clinical parameters including demographics, vitals, and lab results</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="step"
          >
            <div className="step-number">2</div>
            <h3>Feature Selection</h3>
            <p>RFECV automatically selects the 44 most important features</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="step"
          >
            <div className="step-number">3</div>
            <h3>ML Prediction</h3>
            <p>XGBoost model processes the data and generates risk probability</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="step"
          >
            <div className="step-number">4</div>
            <h3>Get Results</h3>
            <p>Receive instant CKD risk prediction with percentage probability</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="about-cta"
      >
        <h2>Ready to Try It?</h2>
        <p>Experience the power of machine learning in healthcare</p>
        <Link to="/predict">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button primary"
          >
            Start Prediction
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
}

export default About;

