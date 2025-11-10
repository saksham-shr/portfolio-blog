import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/portfolio' : 'http://localhost:5000/api/portfolio';

const PortfolioItem = ({ item }) => {
  return (
    <div className="portfolio-item">
      <img src={item.imageUrl || 'https://via.placeholder.com/400x200?text=Project+Image'} alt={item.title} className="portfolio-image" />
      <div className="portfolio-content">
        <h3>{item.title}</h3>
        <p>{item.description.substring(0, 100)}...</p>
        <div className="portfolio-tags">
          {item.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '10px' }}>
          View Project &rarr;
        </a>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(API_URL);
        setItems(res.data);
        setFilteredItems(res.data);
        
        // Extract unique tags
        const allTags = res.data.flatMap(item => item.tags);
        const uniqueTags = ['All', ...new Set(allTags)];
        setTags(uniqueTags);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (activeTag === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.tags.includes(activeTag)));
    }
  }, [activeTag, items]);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading Portfolio...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', padding: '50px 0 20px' }}>My Innovative Portfolio</h1>
      
      {/* Innovative Tag Filter System */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              margin: '5px',
              backgroundColor: activeTag === tag ? 'var(--secondary-color)' : 'var(--surface-dark)',
              color: activeTag === tag ? 'var(--background-dark)' : 'var(--text-light)',
              border: activeTag === tag ? 'none' : '1px solid var(--primary-color)',
              transition: 'all 0.3s',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="portfolio-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <PortfolioItem key={item._id} item={item} />
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No projects found for the tag: {activeTag}
          </p>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
