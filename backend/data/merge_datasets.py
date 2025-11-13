import pandas as pd

def print_columns(df, name):
    print(f"Columns in {name}: {df.columns.tolist()}")

# Load datasets
symptoms_df = pd.read_csv("data/DiseaseAndSymptoms.csv")
desc_df = pd.read_csv("data/symptom_Description.csv")
treatments_df = pd.read_csv("data/disease_treatments.csv")

precautions_df1 = pd.read_csv("data/symptom_precaution.csv")
precautions_df2 = pd.read_csv("data/Disease precaution.csv")

severity_df = pd.read_csv("data/Symptom-severity.csv")

# Print columns
print_columns(symptoms_df, "DiseaseAndSymptoms.csv")
print_columns(desc_df, "symptom_Description.csv")
print_columns(treatments_df, "disease_treatments.csv")
print_columns(precautions_df1, "symptom_precaution.csv")
print_columns(precautions_df2, "Disease precaution.csv")
print_columns(severity_df, "Symptom-severity.csv")

# Helper to combine symptom columns into a single column of symptoms per disease
def combine_symptoms(df):
    symptom_cols = [col for col in df.columns if col.startswith('Symptom_')]
    # Combine symptoms into a comma-separated string, ignoring NaNs
    df['symptoms'] = df[symptom_cols].fillna('').apply(lambda x: ', '.join(filter(None, x)), axis=1)
    return df[['Disease', 'symptoms']]

# Combine symptom datasets
symptoms_df_combined = combine_symptoms(symptoms_df)

# Normalize 'Disease' text to lowercase and strip spaces
symptoms_df_combined['Disease'] = symptoms_df_combined['Disease'].str.lower().str.strip()
symptoms_df_combined['symptoms'] = symptoms_df_combined['symptoms'].str.lower().str.strip()

desc_df['Disease'] = desc_df['Disease'].str.lower().str.strip()
treatments_df['Disease'] = treatments_df['Disease'].str.lower().str.strip()

precautions_df1['Disease'] = precautions_df1['Disease'].str.lower().str.strip()
precautions_df2['Disease'] = precautions_df2['Disease'].str.lower().str.strip()

# Combine precautions data
precautions_combined = pd.concat([precautions_df1, precautions_df2], ignore_index=True)

# Combine precaution columns into single string per disease
precaution_cols = [col for col in precautions_combined.columns if col.startswith('Precaution_')]
precautions_combined['precautions'] = precautions_combined[precaution_cols].fillna('').apply(lambda x: ', '.join(filter(None, x)), axis=1)

# Keep only 'Disease' and 'precautions'
precautions_combined = precautions_combined[['Disease', 'precautions']]

# Merge datasets step by step
merged = symptoms_df_combined.merge(desc_df, on='Disease', how='left')
merged = merged.merge(precautions_combined, on='Disease', how='left')
merged = merged.merge(treatments_df, on='Disease', how='left')

# If multiple rows per disease, group them
final_df = merged.groupby('Disease').agg({
    'symptoms': lambda x: ', '.join(set(x.dropna())),
    'Description': 'first',
    'precautions': 'first',
    'medications': 'first',
    'procedures': 'first',
    'specialist': 'first'
}).reset_index()

# Save to CSV
final_df.to_csv("data/disease_data.csv", index=False)
print("✅ Final merged dataset saved as: data/disease_data.csv")
