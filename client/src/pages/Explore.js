import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/Post';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const fetchExplorePosts = async () => {
    try {
      const response = await axios.get('/api/posts/explore');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await axios.get(`/api/users/search/${searchQuery}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  if (loading) {
    return (
      <div className="explore-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-content">
        <div className="explore-search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="explore-search-input"
          />
          {users.length > 0 && (
            <div className="explore-search-results">
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  className="explore-user-result"
                  onClick={() => setSearchQuery('')}
                >
                  <img
                    src={user.avatar || 'https://via.placeholder.com/40'}
                    alt={user.username}
                    className="explore-user-avatar"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                  <div className="explore-user-info">
                    <div className="explore-username">{user.username}</div>
                    <div className="explore-fullname">{user.fullName}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="explore-posts">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts to explore</p>
            </div>
          ) : (
            <div className="explore-posts-grid">
              {posts.map((post) => (
                <Link key={post._id} to={`/post/${post._id}`} className="explore-post-item">
                  <img
                    src={post.image}
                    alt={post.caption}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300';
                    }}
                  />
                  <div className="explore-post-overlay">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;

