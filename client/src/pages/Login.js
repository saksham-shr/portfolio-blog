import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login({ username, password });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', paddingTop: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface-dark)', padding: '30px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
