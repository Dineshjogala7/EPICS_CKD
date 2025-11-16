# CKD Predictor Frontend

Modern React frontend for the Chronic Kidney Disease prediction system.

## Features

- 🎨 Modern, responsive UI with Framer Motion animations
- 🔐 Firebase OAuth authentication (Google Sign-In)
- 📱 Mobile-friendly design
- 🎯 Beautiful home page with hero section
- 📊 About page showcasing 92.37% model accuracy
- 🧭 Navigation with active route highlighting
- 🎭 Smooth animations and transitions

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Firebase credentials to `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
front/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Navigation bar with auth
│   │   ├── Footer.jsx      # Footer component
│   │   └── PatientForm.jsx # Prediction form
│   ├── pages/
│   │   ├── Home.jsx        # Home page
│   │   ├── About.jsx       # About page
│   │   └── SignUp.jsx     # Authentication page
│   ├── config/
│   │   └── firebase.js     # Firebase configuration
│   ├── constants/
│   │   └── patientFields.js
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── styles.css          # Global styles
├── .env                    # Environment variables (not in git)
├── .env.example            # Example env file
└── package.json
```

## Technologies

- **React 18** - UI library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Firebase** - Authentication
- **Vite** - Build tool

## Pages

- `/` - Home page with hero and features
- `/predict` - Prediction form
- `/about` - About page with model details
- `/signup` - Sign in with Google

## Environment Variables

All Firebase configuration should be in `.env` file. See `.env.example` for the required variables.

