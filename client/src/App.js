import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import SinglePost from './pages/SinglePost';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import CreatePost from './pages/admin/CreatePost';
import CreatePortfolioItem from './pages/admin/CreatePortfolioItem';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute element={Dashboard} adminOnly={true} />} />
          <Route path="/admin/create-post" element={<ProtectedRoute element={CreatePost} adminOnly={true} />} />
          <Route path="/admin/create-portfolio" element={<ProtectedRoute element={CreatePortfolioItem} adminOnly={true} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
