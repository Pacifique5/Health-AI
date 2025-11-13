export async function analyzeSymptoms(symptoms: string) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms }),
  });
  if (!res.ok) throw new Error('Failed to analyze symptoms');
  return res.json();
} 