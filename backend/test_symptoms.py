from app.predictor import SymptomPredictor

p = SymptomPredictor()

print('Test 1: Single symptom (headache)')
print('-' * 50)
result = p.match_disease(['headache'])
print(f'Error: {result.get("error")}')
print(f'Message: {result.get("message")}')
print()

print('Test 2: Two symptoms (headache, vomiting)')
print('-' * 50)
result = p.match_disease(['headache', 'vomiting'])
print(f'Error: {result.get("error")}')
print(f'Message: {result.get("message")}')
print()

print('Test 3: Three symptoms (headache, vomiting, fever)')
print('-' * 50)
result = p.match_disease(['headache', 'vomiting', 'fever'])
if 'error' in result:
    print(f'Error: {result.get("error")}')
    print(f'Message: {result.get("message")}')
else:
    print(f'Disease: {result.get("disease")}')
    print(f'Confidence: {result.get("confidence")}%')
print()

print('Test 4: Unknown symptoms')
print('-' * 50)
result = p.match_disease(['xyz123', 'notreal'])
print(f'Error: {result.get("error")}')
print(f'Message: {result.get("message")}')
