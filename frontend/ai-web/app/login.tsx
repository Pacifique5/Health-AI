import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Login failed');
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
        <h3 style={{ marginBottom: '2rem', fontWeight: 400 }}>Log in or create a new account.</h3>
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