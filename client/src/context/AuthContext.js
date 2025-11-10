import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.NODE_ENV === 'production' ? '/api/auth' : 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would verify the token with the backend
      // For simplicity, we'll just assume the token is valid for now
      // and decode the user info if possible, or just set a placeholder
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        // The payload structure is { user: { id, role }, iat, exp }
        // We need to fetch the full user details or store them in the token
        // For this example, we'll just store the role and id
        setUser({ id: decoded.user.id, role: decoded.user.role, token });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      localStorage.setItem('token', res.data.token);
      setUser({ id: res.data._id, role: res.data.role, token: res.data.token });
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
