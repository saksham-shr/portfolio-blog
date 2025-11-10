import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/posts' : 'http://localhost:5000/api/posts';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');
  const [categories, setCategories] = useState('');
  const [message, setMessage] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const newPost = {
      title,
      content,
      photo,
      categories: categories.split(',').map(cat => cat.trim()),
    };

    try {
      await axios.post(API_URL, newPost, {
        headers: {
          'x-auth-token': user.token,
        },
      });
      setMessage({ type: 'success', text: 'Post created successfully!' });
      setTitle('');
      setContent('');
      setPhoto('');
      setCategories('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to create post.' });
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Blog Post</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface-dark)', padding: '30px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Image URL (Optional)"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categories (comma separated, e.g., Tech, Design)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
        {message && (
          <p style={{ color: message.type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)', marginBottom: '15px' }}>
            {message.text}
          </p>
        )}
        <button type="submit" style={{ width: '100%' }}>Publish Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
