"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateInput = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return emailRegex.test(value) || usernameRegex.test(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!validateInput(username)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Invalid email or password. Please try again.");
        return;
      }

      const data = await res.json();
      const userId = username.toLowerCase();
      
      // Store authentication info and user data
      localStorage.setItem("authToken", "loggedin");
      localStorage.setItem("userId", userId);
      
      // Store user info for profile display
      if (data.user) {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
      } else {
        // Fallback user info
        localStorage.setItem("userInfo", JSON.stringify({
          username: username,
          email: username
        }));
      }
      
      // Initialize conversations if not exists
      if (!localStorage.getItem(`conversations_${userId}`)) {
        localStorage.setItem(`conversations_${userId}`, JSON.stringify([]));
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-slate-950 px-8 py-10 text-white shadow-xl"
      >
        <h3 className="text-xl font-light">Welcome to SymptomAI.</h3>

        {error && (
          <div className="w-full rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        <label className="w-full text-left text-sm text-slate-300">Email</label>
        <input
          className="w-full rounded bg-slate-800 px-3 py-2 text-white outline-none ring-emerald-300 focus:ring-2"
          placeholder="Email"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label className="w-full text-left text-sm text-slate-300">Password</label>
        <input
          type="password"
          className="w-full rounded bg-slate-800 px-3 py-2 text-white outline-none ring-emerald-300 focus:ring-2"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-emerald-300 px-4 py-3 text-lg font-semibold text-slate-900 transition hover:bg-emerald-200"
        >
          Sign In
        </button>

        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-300 underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

