# Enhanced Validation & Accuracy Features

## Overview
The symptom predictor now includes comprehensive validation, accuracy reporting, and intelligent handling of unknown or insufficient symptoms.

## New Features

### 1. Unknown Symptom Detection
- Identifies symptoms that don't match the medical vocabulary
- Provides clear feedback about which symptoms were not recognized
- Suggests using common medical terms

**Example:**
```
Input: ['xyz123', 'notasymptom']
Output: "None of the provided symptoms are recognized. Please check spelling or try different symptom descriptions."
```

### 2. Insufficient Symptom Validation
- Requires minimum number of valid symptoms for diagnosis
- Warns when too few symptoms are provided
- Recommends adding more symptoms for better accuracy

**Example:**
```
Input: ['fever']
Output: "Only 1 valid symptom(s) recognized. Please provide more symptoms for accurate diagnosis."
```

### 3. Confidence & Accuracy Levels
- **High Confidence (≥75%)**: Strong match with provided symptoms
- **Medium Confidence (50-74%)**: Moderate match, more symptoms recommended
- **Low Confidence (<50%)**: Weak match, additional symptoms needed

Each prediction includes:
- Numerical confidence score (0-100%)
- Accuracy level (high/medium/low)
- Human-readable accuracy message

### 4. Symptom Matching Details
- Shows how each input symptom was matched
- Displays fuzzy matching confidence for each symptom
- Handles typos and variations (e.g., "fevr" → "fever")

**Example:**
```
Symptom Matching:
  fevr → fever (85% match)
  coff → cough (80% match)
  hedache → headache (90% match)
```

### 5. Unknown Symptom Reporting
- Lists symptoms that couldn't be matched
- Continues diagnosis with recognized symptoms
- Warns about unused symptoms

**Example:**
```
Recognized: 3/5 symptoms
Unknown symptoms (not used): xyz, invalid
```

### 6. Alternative Diagnoses
- Provides top 3 alternative possible diseases
- Shows confidence score for each alternative
- Helps users consider multiple possibilities

**Example:**
```
Alternative diagnoses:
  - Common Cold (65%)
  - Bronchitis (58%)
  - Pneumonia (52%)
```

### 7. Enhanced Error Messages
Different error types with specific guidance:
- `no_symptoms`: No input provided
- `unknown_symptoms`: All symptoms unrecognized
- `insufficient_symptoms`: Too few valid symptoms
- `low_confidence`: Match found but confidence too low
- `no_match`: No disease matches the symptoms

## API Response Format

### Success Response
```json
{
  "disease": "Influenza",
  "confidence": 85.5,
  "accuracy_level": "high",
  "accuracy_message": "High confidence prediction",
  "description": "Viral infection affecting respiratory system",
  "medications": ["Antiviral drugs", "Pain relievers"],
  "procedures": ["Rest", "Hydration"],
  "precautions": ["Avoid contact", "Wash hands"],
  "specialist": "General Practitioner",
  "matched_symptoms": ["fever", "cough", "fatigue"],
  "symptom_match_info": [
    {"original": "fever", "matched": "fever", "confidence": 100},
    {"original": "coff", "matched": "cough", "confidence": 85}
  ],
  "unknown_symptoms": ["xyz"],
  "total_symptoms_provided": 4,
  "recognized_symptoms": 3,
  "alternative_diagnoses": [
    {"disease": "Common Cold", "confidence": 65.2}
  ]
}
```

### Error Response
```json
{
  "error": "insufficient_symptoms",
  "message": "Only 1 valid symptom(s) recognized...",
  "recognized_symptoms": ["fever"],
  "unknown_symptoms": ["xyz", "abc"],
  "suggestion": "Add more symptoms to improve accuracy..."
}
```

## Configuration Parameters

### `match_disease()` Parameters
- `min_symptoms` (default: 1): Minimum valid symptoms required
- `min_confidence` (default: 30): Minimum confidence threshold (0-100)

**Example:**
```python
# Require at least 2 symptoms with 40% confidence
result = predictor.match_disease(
    symptoms=['fever', 'cough'],
    min_symptoms=2,
    min_confidence=40
)
```

## Testing

Run the validation test suite:
```bash
cd backend
python test_validation.py
```

This will test:
1. Unknown/invalid symptoms
2. Insufficient symptoms
3. High confidence predictions
4. Mixed valid/invalid symptoms
5. Fuzzy matching with typos

## Best Practices

1. **Always provide 2-3+ symptoms** for accurate diagnosis
2. **Use common medical terms** (fever, cough, headache, etc.)
3. **Check unknown_symptoms** in response to correct typos
4. **Review alternative_diagnoses** for differential diagnosis
5. **Consider accuracy_level** when making decisions
6. **Add more symptoms** if confidence is low

## Frontend Integration

The enhanced responses are automatically formatted by the API server. The frontend receives:
- Formatted message with emojis and structure
- Detailed breakdown of symptom matching
- Clear warnings about unknown symptoms
- Alternative diagnoses when available
- Accuracy indicators (🟢 high, 🟡 medium, 🟠 low)
