import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const inputStyle = {
  width: '100%',
  padding: '11px',
  border: '1px solid #E5E9ED',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  color: '#0B2A4A',
  fontSize: '13px',
  marginBottom: '6px',
};

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F4F6F8',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '36px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 4px 16px rgba(11,42,74,0.08)',
        }}
      >
        <h1 style={{ color: '#0B2A4A', fontSize: '24px', margin: '0 0 4px', textAlign: 'center' }}>
          Create an account
        </h1>
        <p style={{ color: '#5C7186', fontSize: '14px', textAlign: 'center', margin: '0 0 24px' }}>
          Join MESsupply today
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          {error && <p style={{ color: '#D93636', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: '#FF5A00',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#5C7186', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF5A00', fontWeight: 600, textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;