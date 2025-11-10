import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/posts' : 'http://localhost:5000/api/posts';

const PostCard = ({ post }) => {
  return (
    <div className="post-card" style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--surface-dark)', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
      {post.photo && (
        <img src={post.photo} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} />
      )}
      <h2 style={{ color: 'var(--primary-color)' }}>
        <Link to={`/post/${post._id}`}>{post.title}</Link>
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
        By {post.author?.username || 'Unknown'} on {new Date(post.createdAt).toDateString()}
      </p>
      <p>{post.content.substring(0, 150)}...</p>
      <Link to={`/post/${post._id}`} style={{ display: 'inline-block', marginTop: '10px' }}>Read More &rarr;</Link>
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation(); // for category filtering

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(API_URL + search);
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [search]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading Blog...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>The MERN Blog</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Blog;
