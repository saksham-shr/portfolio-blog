import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/admin/create-post">
          <button>Create New Blog Post</button>
        </Link>
        <Link to="/admin/create-portfolio">
          <button>Add New Portfolio Item</button>
        </Link>
        {/* Future links for managing posts, users, categories, etc. */}
      </div>
      <div style={{ marginTop: '50px', padding: '20px', backgroundColor: 'var(--surface-dark)', borderRadius: '8px' }}>
        <h2>Quick Info</h2>
        <p>This is the administrative area. Only users with the 'admin' role can access this page.</p>
        <p>Use the buttons above to manage your content.</p>
      </div>
    </div>
  );
};

export default Dashboard;
