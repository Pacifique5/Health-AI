"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      // User is authenticated, redirect to dashboard
      router.replace("/dashboard");
    } else {
      // User is not authenticated, redirect to login
      router.replace("/login");
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-slate-600">Loading SymptomAI...</p>
      </div>
    </div>
  );
}
