"""
Test script to verify the prediction API works correctly.
Run this after training the model and starting the Flask server.
"""

import requests
import json

# Test patient data (high risk case)
test_patient = {
    "Age": 68,
    "Gender": 0,
    "Ethnicity": 1,
    "SocioeconomicStatus": 1,
    "EducationLevel": 2,
    "BMI": 29.8,
    "Smoking": 1,
    "AlcoholConsumption": 1,
    "PhysicalActivity": 1,
    "DietQuality": 1,
    "SleepQuality": 2,
    "FamilyHistoryKidneyDisease": 1,
    "FamilyHistoryHypertension": 1,
    "FamilyHistoryDiabetes": 1,
    "PreviousAcuteKidneyInjury": 1,
    "UrinaryTractInfections": 1,
    "SystolicBP": 160,
    "DiastolicBP": 95,
    "FastingBloodSugar": 160,
    "HbA1c": 8.5,
    "SerumCreatinine": 3.8,
    "BUNLevels": 55,
    "GFR": 25,
    "ProteinInUrine": 1,
    "ACR": 450,
    "SerumElectrolytesSodium": 134,
    "SerumElectrolytesPotassium": 5.4,
    "SerumElectrolytesCalcium": 8.2,
    "SerumElectrolytesPhosphorus": 5.1,
    "HemoglobinLevels": 10.5,
    "CholesterolTotal": 240,
    "CholesterolLDL": 160,
    "CholesterolHDL": 35,
    "CholesterolTriglycerides": 200,
    "ACEInhibitors": 1,
    "Diuretics": 1,
    "NSAIDsUse": 1,
    "Statins": 1,
    "AntidiabeticMedications": 1,
    "Edema": 1,
    "FatigueLevels": 4,
    "NauseaVomiting": 1,
    "MuscleCramps": 1,
    "Itching": 1,
    "QualityOfLifeScore": 2,
    "HeavyMetalsExposure": 1,
    "OccupationalExposureChemicals": 1,
    "WaterQuality": 0,
    "MedicalCheckupsFrequency": 1,
    "MedicationAdherence": 1,
    "HealthLiteracy": 1
}

API_URL = "http://localhost:5000/api/predict"


def test_prediction():
    """Test the prediction endpoint."""
    print("🧪 Testing CKD Prediction API...")
    print(f"📡 Sending request to: {API_URL}")
    print(f"📋 Patient data: {len(test_patient)} fields")
    
    try:
        response = requests.post(
            API_URL,
            json=test_patient,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {data.get('status')}")
            print(f"🎯 CKD Risk: {data.get('prediction_percent')}%")
            print(f"📈 Probability: {data.get('prediction_probability')}")
            print("\n✅ Test passed!")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API.")
        print("   Make sure the Flask server is running on http://localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        API_URL = sys.argv[1]
    
    success = test_prediction()
    sys.exit(0 if success else 1)

