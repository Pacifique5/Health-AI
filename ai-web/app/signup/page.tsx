"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setError(
        "Username must be at least 3 characters and contain only letters, numbers, and underscores"
      );
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        setError("Signup failed. Please try again.");
        return;
      }

      const userId = email.toLowerCase();
      localStorage.removeItem(`conversations_${userId}`);
      localStorage.setItem(`conversations_${userId}`, JSON.stringify([]));
      router.push("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-slate-950 px-8 py-10 text-white shadow-xl"
      >
        <h3 className="text-xl font-light">Create a new account</h3>

        {error && (
          <div className="w-full rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        <label className="w-full text-left text-sm text-slate-300">Username</label>
        <input
          className="w-full rounded bg-slate-800 px-3 py-2 text-white outline-none ring-emerald-300 focus:ring-2"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label className="w-full text-left text-sm text-slate-300">Email</label>
        <input
          type="email"
          className="w-full rounded bg-slate-800 px-3 py-2 text-white outline-none ring-emerald-300 focus:ring-2"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          Signup
        </button>

        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-300 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

