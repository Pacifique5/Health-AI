"""
Test script to demonstrate new validation and accuracy features
"""
from app.predictor import SymptomPredictor

def test_scenarios():
    predictor = SymptomPredictor()
    
    print("=" * 80)
    print("TESTING NEW VALIDATION & ACCURACY FEATURES")
    print("=" * 80)
    
    # Test 1: Unknown symptoms
    print("\n1️⃣ TEST: Unknown/Invalid Symptoms")
    print("-" * 80)
    result = predictor.match_disease(['xyz123', 'abcdef', 'notasymptom'])
    print(f"Input: ['xyz123', 'abcdef', 'notasymptom']")
    print(f"Result: {result.get('error', 'No error')}")
    print(f"Message: {result.get('message', 'N/A')}")
    
    # Test 2: Insufficient symptoms
    print("\n2️⃣ TEST: Insufficient Symptoms (only 1 symptom)")
    print("-" * 80)
    result = predictor.match_disease(['fever'])
    print(f"Input: ['fever']")
    if 'error' in result:
        print(f"Error: {result['error']}")
        print(f"Message: {result['message']}")
        print(f"Recognized: {result.get('recognized_symptoms', [])}")
    else:
        print(f"Disease: {result['disease']}")
        print(f"Confidence: {result['confidence']}%")
        print(f"Accuracy Level: {result['accuracy_level']}")
    
    # Test 3: Good symptoms with high confidence
    print("\n3️⃣ TEST: Multiple Valid Symptoms (High Confidence)")
    print("-" * 80)
    result = predictor.match_disease(['fever', 'cough', 'fatigue', 'body ache'])
    print(f"Input: ['fever', 'cough', 'fatigue', 'body ache']")
    if 'error' not in result:
        print(f"Disease: {result['disease']}")
        print(f"Confidence: {result['confidence']}%")
        print(f"Accuracy Level: {result['accuracy_level']}")
        print(f"Accuracy Message: {result['accuracy_message']}")
        print(f"Recognized: {result['recognized_symptoms']}/{result['total_symptoms_provided']} symptoms")
        if result.get('alternative_diagnoses'):
            print(f"Alternatives: {[alt['disease'] for alt in result['alternative_diagnoses']]}")
    
    # Test 4: Mix of valid and invalid symptoms
    print("\n4️⃣ TEST: Mixed Valid & Invalid Symptoms")
    print("-" * 80)
    result = predictor.match_disease(['headache', 'xyz', 'nausea', 'invalid', 'vomiting'])
    print(f"Input: ['headache', 'xyz', 'nausea', 'invalid', 'vomiting']")
    if 'error' not in result:
        print(f"Disease: {result['disease']}")
        print(f"Confidence: {result['confidence']}%")
        print(f"Recognized: {result['recognized_symptoms']}/{result['total_symptoms_provided']} symptoms")
        print(f"Unknown symptoms: {result.get('unknown_symptoms', [])}")
        print(f"\nSymptom Matching Details:")
        for match in result.get('symptom_match_info', []):
            print(f"  {match['original']} → {match['matched']} ({match['confidence']}%)")
    
    # Test 5: Fuzzy matching
    print("\n5️⃣ TEST: Fuzzy Matching (Typos)")
    print("-" * 80)
    result = predictor.match_disease(['fevr', 'coff', 'hedache'])  # Typos
    print(f"Input: ['fevr', 'coff', 'hedache'] (with typos)")
    if 'error' not in result:
        print(f"Disease: {result['disease']}")
        print(f"Confidence: {result['confidence']}%")
        print(f"\nSymptom Corrections:")
        for match in result.get('symptom_match_info', []):
            print(f"  {match['original']} → {match['matched']} ({match['confidence']}% match)")
    
    print("\n" + "=" * 80)
    print("TESTING COMPLETE")
    print("=" * 80)

if __name__ == '__main__':
    test_scenarios()
