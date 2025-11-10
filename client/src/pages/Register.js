import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ username, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.msg || 'Registration failed. User may already exist.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', paddingTop: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface-dark)', padding: '30px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>Register</button>
      </form>
    </div>
  );
};

export default Register;
