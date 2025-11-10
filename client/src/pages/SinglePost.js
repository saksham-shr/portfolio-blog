import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/posts' : 'http://localhost:5000/api/posts';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading Post...</div>;
  }

  if (!post) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Post not found.</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '50px', maxWidth: '800px' }}>
      {post.photo && (
        <img src={post.photo} alt={post.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '30px' }} />
      )}
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>{post.title}</h1>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <span>Author: {post.author?.username || 'Unknown'}</span>
        <span style={{ marginLeft: '20px' }}>Date: {new Date(post.createdAt).toDateString()}</span>
        <span style={{ marginLeft: '20px' }}>Categories: {post.categories.join(', ')}</span>
      </div>
      <div className="post-content" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
        {/* In a real app, you'd use a markdown renderer or dangerouslySetInnerHTML */}
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default SinglePost;
