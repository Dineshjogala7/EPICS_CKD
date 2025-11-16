import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: "/", label: "Home" },
    { path: "/predict", label: "Predict" },
    { path: "/about", label: "About" },
  ];

  const socialLinks = [
    { icon: "📧", label: "Email", href: "mailto:contact@ckdpredictor.com" },
    { icon: "🐙", label: "GitHub", href: "https://github.com/Dineshjogala7/EPICS_CKD" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="footer"
    >
      <div className="footer-container">
        <div className="footer-section">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            CKD Predictor
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="footer-description"
          >
            Advanced machine learning model for predicting Chronic Kidney Disease risk
            with 92.37% accuracy.
          </motion.p>
        </div>

        <div className="footer-section">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Quick Links
          </motion.h4>
          <ul className="footer-links">
            {footerLinks.map((link, index) => (
              <motion.li
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link to={link.path}>{link.label}</Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Connect
          </motion.h4>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="social-link"
              >
                <span className="social-icon">{social.icon}</span>
                <span>{social.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="footer-bottom"
      >
        <p>
          © {currentYear} CKD Predictor. Built with React, Flask, and XGBoost.
        </p>
      </motion.div>
    </motion.footer>
  );
}

export default Footer;

