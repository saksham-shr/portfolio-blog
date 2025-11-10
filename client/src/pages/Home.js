import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <header style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>Welcome to the MERN Stack Blog & Portfolio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          A complete, production-ready application built with MongoDB, Express, React, and Node.js.
        </p>
        <div style={{ marginTop: '30px' }}>
          <Link to="/portfolio">
            <button style={{ marginRight: '20px' }}>View Portfolio</button>
          </Link>
          <Link to="/blog">
            <button>Read Blog</button>
          </Link>
        </div>
      </header>
      <section style={{ padding: '50px 0', borderTop: '1px solid #333' }}>
        <h2>Innovative Design Philosophy</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          The design focuses on a **dark, minimalist aesthetic** to make content and portfolio pieces stand out. We use a vibrant **primary color (Cyan)** for accents and interactive elements, ensuring a modern and engaging user experience. The portfolio section, in particular, will feature a **dynamic, tag-based filtering system** and **interactive hover effects** to showcase projects effectively.
        </p>
      </section>
    </div>
  );
};

export default Home;
