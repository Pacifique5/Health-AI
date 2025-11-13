"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateInput = (input: string) => {
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Username: alphanumeric, 3+ chars, no spaces
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return emailRegex.test(input) || usernameRegex.test(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateInput(username)) {
      setError('Please enter a valid email address.');
      return;
    }
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      // Store both auth token and user ID
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', 'loggedin');
        // Use a consistent format for the user ID
        const userId = username.toLowerCase(); // Convert to lowercase for consistency
        localStorage.setItem('userId', userId);
        // Initialize conversations if they don't exist
        if (!localStorage.getItem(`conversations_${userId}`)) {
          localStorage.setItem(`conversations_${userId}`, JSON.stringify([]));
        }
      }
      router.push('/'); // Redirect to chatbot
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#7fffd4',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#181c2b',
          borderRadius: '18px',
          padding: '2.5rem 2.5rem 1.5rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          minWidth: '340px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h3 style={{ marginBottom: '1rem', fontWeight: 400 }}>Welcome to SymptomAI.</h3>
        {error && (
          <div style={{
            color: '#ff6b6b',
            background: '#23263a',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            width: '100%',
            textAlign: 'center',
            fontSize: '0.98rem',
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}
        <label style={{ alignSelf: 'flex-start', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Email</label>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            marginBottom: '1.2rem',
            borderRadius: '2px',
            border: 'none',
            background: '#23263a',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <label style={{ alignSelf: 'flex-start', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            marginBottom: '2rem',
            borderRadius: '2px',
            border: 'none',
            background: '#23263a',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.9rem',
            background: '#7fffd4',
            color: '#181c2b',
            border: 'none',
            borderRadius: '24px',
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '1.2rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Sign In
        </button>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ color: '#b0b8d1', fontSize: '0.98rem' }}>
            Don&apos;t have an account?{' '}
            <a href="/signup" style={{ color: '#7fffd4', textDecoration: 'underline' }}>
              Create one
            </a>
          </span>
        </div>
      </form>
    </div>
  );
} 