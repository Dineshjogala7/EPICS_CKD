import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "🎯",
      title: "High Accuracy",
      description: "92.37% accuracy using advanced XGBoost machine learning",
    },
    {
      icon: "⚡",
      title: "Fast Prediction",
      description: "Get instant results with our optimized prediction pipeline",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is encrypted and never stored permanently",
    },
    {
      icon: "📊",
      title: "Comprehensive Analysis",
      description: "Analyzes 44+ clinical features for accurate risk assessment",
    },
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
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hero-title"
          >
            Predict Chronic Kidney Disease Risk
            <br />
            <span className="gradient-text">with 92.37% Accuracy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hero-description"
          >
            Advanced machine learning model powered by XGBoost and RFECV feature
            selection. Get instant, accurate predictions to help with early
            detection and prevention.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hero-actions"
          >
            <Link to="/predict">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="cta-button primary"
              >
                Start Prediction
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button secondary"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="hero-visual"
        >
          <div className="floating-card">
            <div className="card-icon">🩺</div>
            <div className="card-stats">
              <div className="stat">
                <span className="stat-value">92.37%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat-value">44+</span>
                <span className="stat-label">Features</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>Why Choose Our Predictor?</h2>
          <p>Powered by cutting-edge machine learning technology</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="features-grid"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="cta-section"
      >
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Start predicting CKD risk in minutes</p>
          <Link to="/predict">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button primary large"
            >
              Try It Now
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;

