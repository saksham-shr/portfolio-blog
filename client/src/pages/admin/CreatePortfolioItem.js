import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/portfolio' : 'http://localhost:5000/api/portfolio';

const CreatePortfolioItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const newItem = {
      title,
      description,
      imageUrl,
      link,
      tags: tags.split(',').map(tag => tag.trim()),
    };

    try {
      await axios.post(API_URL, newItem, {
        headers: {
          'x-auth-token': user.token,
        },
      });
      setMessage({ type: 'success', text: 'Portfolio item created successfully!' });
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLink('');
      setTags('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to create portfolio item.' });
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Add New Portfolio Item</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface-dark)', padding: '30px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Project Description"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Project Link (e.g., GitHub or Live Demo)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated, e.g., React, Node.js, Design)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {message && (
          <p style={{ color: message.type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)', marginBottom: '15px' }}>
            {message.text}
          </p>
        )}
        <button type="submit" style={{ width: '100%' }}>Add Item</button>
      </form>
    </div>
  );
};

export default CreatePortfolioItem;
