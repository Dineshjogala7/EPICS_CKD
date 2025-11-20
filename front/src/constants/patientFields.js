// Helper function to format binary fields (0/1 to Yes/No)
export const formatBinaryValue = (value, fieldName) => {
  const binaryFields = [
    "Gender",
    "Smoking",
    "FamilyHistoryKidneyDisease",
    "FamilyHistoryHypertension",
    "FamilyHistoryDiabetes",
    "PreviousAcuteKidneyInjury",
    "UrinaryTractInfections",
    "Edema",
    "ACEInhibitors",
    "Diuretics",
    "Statins",
    "AntidiabeticMedications",
    "HeavyMetalsExposure",
  ];
  
  if (binaryFields.includes(fieldName)) {
    if (value === 0 || value === "0") return "No";
    if (value === 1 || value === "1") return "Yes";
  }
  
  return value;
};

// Field metadata with ranges, units, and types
const FIELD_METADATA = {
  Age: { min: 20, max: 90, unit: "years", type: "numeric" },
  Gender: { type: "binary", options: { 0: "Male", 1: "Female" } },
  Ethnicity: { 
    type: "categorical", 
    options: { 
      0: "Caucasian", 
      1: "African American", 
      2: "Asian", 
      3: "Other" 
    } 
  },
  SocioeconomicStatus: { type: "numeric" },
  EducationLevel: { 
    type: "categorical", 
    options: { 
      0: "None", 
      1: "High School", 
      2: "Bachelor's", 
      3: "Higher" 
    } 
  },
  BMI: { min: 15, max: 40, unit: "", type: "numeric" },
  Smoking: { type: "binary", options: { 0: "No", 1: "Yes" } },
  AlcoholConsumption: { min: 0, max: 20, unit: "units/week", type: "numeric" },
  PhysicalActivity: { min: 0, max: 10, unit: "hours/week", type: "numeric" },
  DietQuality: { min: 0, max: 10, unit: "score", type: "numeric" },
  SleepQuality: { min: 4, max: 10, unit: "score", type: "numeric" },
  FamilyHistoryKidneyDisease: { type: "binary", options: { 0: "No", 1: "Yes" } },
  FamilyHistoryHypertension: { type: "binary", options: { 0: "No", 1: "Yes" } },
  FamilyHistoryDiabetes: { type: "binary", options: { 0: "No", 1: "Yes" } },
  PreviousAcuteKidneyInjury: { type: "binary", options: { 0: "No", 1: "Yes" } },
  UrinaryTractInfections: { type: "binary", options: { 0: "No", 1: "Yes" } },
  SystolicBP: { min: 90, max: 180, unit: "mmHg", type: "numeric" },
  DiastolicBP: { min: 60, max: 120, unit: "mmHg", type: "numeric" },
  FastingBloodSugar: { min: 70, max: 200, unit: "mg/dL", type: "numeric" },
  HbA1c: { min: 4.0, max: 10.0, unit: "%", type: "numeric" },
  SerumCreatinine: { min: 0.5, max: 5.0, unit: "mg/dL", type: "numeric" },
  BUNLevels: { min: 5, max: 50, unit: "mg/dL", type: "numeric" },
  GFR: { min: 15, max: 120, unit: "mL/min/1.73 m²", type: "numeric" },
  ProteinInUrine: { min: 0, max: 5, unit: "g/day", type: "numeric" },
  ACR: { min: 0, max: 300, unit: "mg/g", type: "numeric" },
  SerumElectrolytesSodium: { min: 135, max: 145, unit: "mEq/L", type: "numeric" },
  SerumElectrolytesPotassium: { min: 3.5, max: 5.5, unit: "mEq/L", type: "numeric" },
  SerumElectrolytesCalcium: { min: 8.5, max: 10.5, unit: "mg/dL", type: "numeric" },
  SerumElectrolytesPhosphorus: { min: 2.5, max: 4.5, unit: "mg/dL", type: "numeric" },
  HemoglobinLevels: { min: 10, max: 18, unit: "g/dL", type: "numeric" },
  CholesterolTotal: { min: 150, max: 300, unit: "mg/dL", type: "numeric" },
  CholesterolLDL: { min: 50, max: 200, unit: "mg/dL", type: "numeric" },
  CholesterolHDL: { min: 20, max: 100, unit: "mg/dL", type: "numeric" },
  CholesterolTriglycerides: { min: 50, max: 400, unit: "mg/dL", type: "numeric" },
  ACEInhibitors: { type: "binary", options: { 0: "No", 1: "Yes" } },
  Diuretics: { type: "binary", options: { 0: "No", 1: "Yes" } },
  NSAIDsUse: { min: 0, max: 10, unit: "times/week", type: "numeric" },
  Statins: { type: "binary", options: { 0: "No", 1: "Yes" } },
  AntidiabeticMedications: { type: "binary", options: { 0: "No", 1: "Yes" } },
  Edema: { type: "binary", options: { 0: "No", 1: "Yes" } },
  FatigueLevels: { min: 0, max: 10, unit: "score", type: "numeric" },
  NauseaVomiting: { min: 0, max: 7, unit: "times/week", type: "numeric" },
  MuscleCramps: { min: 0, max: 7, unit: "times/week", type: "numeric" },
  Itching: { min: 0, max: 10, unit: "severity", type: "numeric" },
  QualityOfLifeScore: { min: 0, max: 100, unit: "score", type: "numeric" },
  HeavyMetalsExposure: { type: "binary", options: { 0: "No", 1: "Yes" } },
  OccupationalExposureChemicals: { type: "numeric" },
  WaterQuality: { type: "numeric" },
  MedicalCheckupsFrequency: { type: "numeric" },
  MedicationAdherence: { type: "numeric" },
  HealthLiteracy: { type: "numeric" },
};

// Helper to get field helper text
export const getFieldHelper = (fieldName) => {
  const meta = FIELD_METADATA[fieldName];
  if (!meta) return null;
  
  if (meta.type === "binary") {
    return `Range: ${Object.keys(meta.options).map(k => `${k} = ${meta.options[k]}`).join(", ")}`;
  }
  
  if (meta.min !== undefined && meta.max !== undefined) {
    const unitText = meta.unit ? ` (${meta.unit})` : "";
    return `Range: ${meta.min} - ${meta.max}${unitText}`;
  }
  
  if (meta.unit) {
    return `Unit: ${meta.unit}`;
  }
  
  return null;
};

export const PATIENT_FIELDS = [
  {
    section: "Demographics",
    items: [
      { 
        name: "Age", 
        label: "Age", 
        type: "number", 
        min: 20, 
        max: 90,
        helper: "Range: 20 - 90 years"
      },
      {
        name: "Gender",
        label: "Gender",
        type: "select",
        options: [
          { value: 0, label: "Male" },
          { value: 1, label: "Female" },
        ],
        helper: "Range: 0 = Male, 1 = Female"
      },
      {
        name: "Ethnicity",
        label: "Ethnicity",
        type: "select",
        options: [
          { value: 0, label: "Caucasian" },
          { value: 1, label: "African American" },
          { value: 2, label: "Asian" },
          { value: 3, label: "Other" },
        ],
        helper: "Range: 0 = Caucasian, 1 = African American, 2 = Asian, 3 = Other"
      },
      {
        name: "SocioeconomicStatus",
        label: "Socioeconomic Status",
        type: "number",
        helper: "Socioeconomic status value"
      },
      { 
        name: "EducationLevel", 
        label: "Education Level", 
        type: "select",
        options: [
          { value: 0, label: "None" },
          { value: 1, label: "High School" },
          { value: 2, label: "Bachelor's" },
          { value: 3, label: "Higher" },
        ],
        helper: "Range: 0 = None, 1 = High School, 2 = Bachelor's, 3 = Higher"
      },
    ],
  },
  {
    section: "Lifestyle & Habits",
    items: [
      { 
        name: "BMI", 
        label: "BMI", 
        type: "number", 
        step: 0.1,
        min: 15,
        max: 40,
        helper: "Range: 15 - 40"
      },
      { 
        name: "Smoking", 
        label: "Smoking", 
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      { 
        name: "AlcoholConsumption", 
        label: "Alcohol Consumption", 
        type: "number",
        min: 0,
        max: 20,
        helper: "Range: 0 - 20 units/week"
      },
      { 
        name: "PhysicalActivity", 
        label: "Physical Activity", 
        type: "number",
        min: 0,
        max: 10,
        helper: "Range: 0 - 10 hours/week"
      },
      { 
        name: "DietQuality", 
        label: "Diet Quality", 
        type: "number",
        min: 0,
        max: 10,
        helper: "Range: 0 - 10 score"
      },
      { 
        name: "SleepQuality", 
        label: "Sleep Quality", 
        type: "number",
        min: 4,
        max: 10,
        helper: "Range: 4 - 10 score"
      },
    ],
  },
  {
    section: "Family History",
    items: [
      {
        name: "FamilyHistoryKidneyDisease",
        label: "Kidney Disease",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      {
        name: "FamilyHistoryHypertension",
        label: "Hypertension",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      { 
        name: "FamilyHistoryDiabetes", 
        label: "Diabetes",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
    ],
  },
  {
    section: "Medical History",
    items: [
      {
        name: "PreviousAcuteKidneyInjury",
        label: "Previous Acute Kidney Injury",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      {
        name: "UrinaryTractInfections",
        label: "Urinary Tract Infections",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      { 
        name: "Edema", 
        label: "Edema",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      { 
        name: "FatigueLevels", 
        label: "Fatigue Levels", 
        type: "number",
        min: 0,
        max: 10,
        helper: "Range: 0 - 10 score"
      },
      { 
        name: "NauseaVomiting", 
        label: "Nausea / Vomiting", 
        type: "number",
        min: 0,
        max: 7,
        helper: "Range: 0 - 7 times/week"
      },
      { 
        name: "MuscleCramps", 
        label: "Muscle Cramps", 
        type: "number",
        min: 0,
        max: 7,
        helper: "Range: 0 - 7 times/week"
      },
      { 
        name: "Itching", 
        label: "Itching", 
        type: "number",
        min: 0,
        max: 10,
        helper: "Range: 0 - 10 severity"
      },
      {
        name: "QualityOfLifeScore",
        label: "Quality Of Life Score",
        type: "number",
        min: 0,
        max: 100,
        helper: "Range: 0 - 100 score"
      },
    ],
  },
  {
    section: "Vitals",
    items: [
      { 
        name: "SystolicBP", 
        label: "Systolic BP", 
        type: "number",
        min: 90,
        max: 180,
        helper: "Range: 90 - 180 mmHg"
      },
      { 
        name: "DiastolicBP", 
        label: "Diastolic BP", 
        type: "number",
        min: 60,
        max: 120,
        helper: "Range: 60 - 120 mmHg"
      },
    ],
  },
  {
    section: "Laboratory Values",
    items: [
      { 
        name: "FastingBloodSugar", 
        label: "Fasting Blood Sugar", 
        type: "number",
        min: 70,
        max: 200,
        helper: "Range: 70 - 200 mg/dL"
      },
      { 
        name: "HbA1c", 
        label: "HbA1c", 
        type: "number", 
        step: 0.1,
        min: 4.0,
        max: 10.0,
        helper: "Range: 4.0 - 10.0%"
      },
      { 
        name: "SerumCreatinine", 
        label: "Serum Creatinine", 
        type: "number", 
        step: 0.1,
        min: 0.5,
        max: 5.0,
        helper: "Range: 0.5 - 5.0 mg/dL"
      },
      { 
        name: "BUNLevels", 
        label: "BUN Levels", 
        type: "number",
        min: 5,
        max: 50,
        helper: "Range: 5 - 50 mg/dL"
      },
      { 
        name: "GFR", 
        label: "GFR", 
        type: "number",
        min: 15,
        max: 120,
        helper: "Range: 15 - 120 mL/min/1.73 m²"
      },
      { 
        name: "ProteinInUrine", 
        label: "Protein In Urine", 
        type: "number",
        min: 0,
        max: 5,
        helper: "Range: 0 - 5 g/day"
      },
      { 
        name: "ACR", 
        label: "Albumin Creatinine Ratio (ACR)", 
        type: "number",
        min: 0,
        max: 300,
        helper: "Range: 0 - 300 mg/g"
      },
      {
        name: "SerumElectrolytesSodium",
        label: "Sodium",
        type: "number",
        min: 135,
        max: 145,
        helper: "Range: 135 - 145 mEq/L"
      },
      {
        name: "SerumElectrolytesPotassium",
        label: "Potassium",
        type: "number",
        min: 3.5,
        max: 5.5,
        helper: "Range: 3.5 - 5.5 mEq/L"
      },
      {
        name: "SerumElectrolytesCalcium",
        label: "Calcium",
        type: "number",
        step: 0.1,
        min: 8.5,
        max: 10.5,
        helper: "Range: 8.5 - 10.5 mg/dL"
      },
      {
        name: "SerumElectrolytesPhosphorus",
        label: "Phosphorus",
        type: "number",
        step: 0.1,
        min: 2.5,
        max: 4.5,
        helper: "Range: 2.5 - 4.5 mg/dL"
      },
      { 
        name: "HemoglobinLevels", 
        label: "Hemoglobin Levels", 
        type: "number",
        min: 10,
        max: 18,
        helper: "Range: 10 - 18 g/dL"
      },
      { 
        name: "CholesterolTotal", 
        label: "Cholesterol Total", 
        type: "number",
        min: 150,
        max: 300,
        helper: "Range: 150 - 300 mg/dL"
      },
      { 
        name: "CholesterolLDL", 
        label: "Cholesterol LDL", 
        type: "number",
        min: 50,
        max: 200,
        helper: "Range: 50 - 200 mg/dL"
      },
      { 
        name: "CholesterolHDL", 
        label: "Cholesterol HDL", 
        type: "number",
        min: 20,
        max: 100,
        helper: "Range: 20 - 100 mg/dL"
      },
      {
        name: "CholesterolTriglycerides",
        label: "Cholesterol Triglycerides",
        type: "number",
        min: 50,
        max: 400,
        helper: "Range: 50 - 400 mg/dL"
      },
    ],
  },
  {
    section: "Medications",
    items: [
      { 
        name: "ACEInhibitors", 
        label: "ACE Inhibitors",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      { 
        name: "Diuretics", 
        label: "Diuretics",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      { 
        name: "NSAIDsUse", 
        label: "NSAIDs Use", 
        type: "number",
        min: 0,
        max: 10,
        helper: "Range: 0 - 10 times/week"
      },
      { 
        name: "Statins", 
        label: "Statins",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      {
        name: "AntidiabeticMedications",
        label: "Antidiabetic Medications",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
    ],
  },
  {
    section: "Environmental Factors",
    items: [
      {
        name: "HeavyMetalsExposure",
        label: "Heavy Metals Exposure",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
        helper: "Range: 0 = No, 1 = Yes"
      },
      {
        name: "OccupationalExposureChemicals",
        label: "Occupational Chemical Exposure",
        type: "number",
      },
      { name: "WaterQuality", label: "Water Quality", type: "number" },
    ],
  },
  {
    section: "Healthcare Engagement",
    items: [
      {
        name: "MedicalCheckupsFrequency",
        label: "Medical Checkups Frequency",
        type: "number",
      },
      {
        name: "MedicationAdherence",
        label: "Medication Adherence",
        type: "number",
      },
      { name: "HealthLiteracy", label: "Health Literacy", type: "number" },
    ],
  },
];

export const SAMPLE_PATIENT = {
  Age: 68,
  Gender: 0,
  Ethnicity: 1,
  SocioeconomicStatus: 1,
  EducationLevel: 2,
  BMI: 29.8,
  Smoking: 1,
  AlcoholConsumption: 1,
  PhysicalActivity: 1,
  DietQuality: 1,
  SleepQuality: 2,
  FamilyHistoryKidneyDisease: 1,
  FamilyHistoryHypertension: 1,
  FamilyHistoryDiabetes: 1,
  PreviousAcuteKidneyInjury: 1,
  UrinaryTractInfections: 1,
  SystolicBP: 160,
  DiastolicBP: 95,
  FastingBloodSugar: 160,
  HbA1c: 8.5,
  SerumCreatinine: 3.8,
  BUNLevels: 55,
  GFR: 25,
  ProteinInUrine: 1,
  ACR: 450,
  SerumElectrolytesSodium: 134,
  SerumElectrolytesPotassium: 5.4,
  SerumElectrolytesCalcium: 8.2,
  SerumElectrolytesPhosphorus: 5.1,
  HemoglobinLevels: 10.5,
  CholesterolTotal: 240,
  CholesterolLDL: 160,
  CholesterolHDL: 35,
  CholesterolTriglycerides: 200,
  ACEInhibitors: 1,
  Diuretics: 1,
  NSAIDsUse: 1,
  Statins: 1,
  AntidiabeticMedications: 1,
  Edema: 1,
  FatigueLevels: 4,
  NauseaVomiting: 1,
  MuscleCramps: 1,
  Itching: 1,
  QualityOfLifeScore: 2,
  HeavyMetalsExposure: 1,
  OccupationalExposureChemicals: 1,
  WaterQuality: 0,
  MedicalCheckupsFrequency: 1,
  MedicationAdherence: 1,
  HealthLiteracy: 1,
};
