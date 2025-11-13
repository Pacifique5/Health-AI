def clean_symptoms(symptom_str):
    return [sym.strip().lower() for sym in symptom_str.split(',') if sym.strip()]