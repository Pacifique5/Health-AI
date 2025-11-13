"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setError('Username must be at least 3 characters and contain only letters, numbers, and underscores');
      return;
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      // Clear any existing data for this user
      if (typeof window !== 'undefined') {
        const userId = email.toLowerCase(); // Use email as consistent ID
        localStorage.removeItem(`conversations_${userId}`);
        // Initialize empty conversations array
        localStorage.setItem(`conversations_${userId}`, JSON.stringify([]));
      }
      router.push('/login');
    } else {
      setError('Signup failed. Please try again.');
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
        <h3 style={{ marginBottom: '2rem', fontWeight: 400 }}>Create a new account</h3>
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
        <label style={{ alignSelf: 'flex-start', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Username</label>
        <input
          type="text"
          placeholder="Username"
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
        <label style={{ alignSelf: 'flex-start', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Signup
        </button>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ color: '#b0b8d1', fontSize: '0.98rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#7fffd4', textDecoration: 'underline' }}>
              Log in
            </a>
          </span>
        </div>
      </form>
    </div>
  );
} 