import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="container topbar-container">
        <div className="logo">
          <Link to="/">MERN Stack</Link>
        </div>
        <nav>
          <ul className="nav-list">
            <li className="nav-list-item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-list-item">
              <Link to="/portfolio">Portfolio</Link>
            </li>
            <li className="nav-list-item">
              <Link to="/blog">Blog</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-list-item">
                <Link to="/admin">Admin</Link>
              </li>
            )}
            {user ? (
              <li className="nav-list-item">
                <button onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-list-item">
                  <Link to="/login">Login</Link>
                </li>
                <li className="nav-list-item">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TopBar;
