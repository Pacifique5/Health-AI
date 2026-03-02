export async function analyzeSymptoms(symptoms: string) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });

  const data = await res.json();
  
  // Return the message regardless of status code
  // The backend sends helpful messages even for errors (422, etc.)
  if (data.message) {
    return { message: data.message };
  }
  
  // Fallback if no message in response
  if (!res.ok) {
    throw new Error(data.error || "Failed to analyze symptoms");
  }

  return data as { message: string };
}

