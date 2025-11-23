import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setProfileUser(response.data.user);
      setFollowing(response.data.user.isFollowing);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts/user/${userId}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(`/api/follow/${userId}`);
      setFollowing(response.data.following);
      fetchProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-container">
        <div className="error">User not found</div>
      </div>
    );
  }

  const isOwnProfile = (currentUser?.id === userId) || (currentUser?._id === userId) || (currentUser?.id?.toString() === userId) || (currentUser?._id?.toString() === userId);

  return (
    <div className="profile-container">
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={profileUser.avatar || 'https://via.placeholder.com/150'}
            alt={profileUser.username}
            className="profile-avatar"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        </div>
        <div className="profile-info">
          <div className="profile-header-top">
            <h1 className="profile-username">{profileUser.username}</h1>
            {isOwnProfile ? (
              <>
                <Link to="/edit-profile" className="profile-edit-btn">
                  Edit Profile
                </Link>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="profile-edit-btn"
                >
                  Create Post
                </button>
              </>
            ) : (
              <button
                onClick={handleFollow}
                className={`profile-follow-btn ${following ? 'following' : ''}`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{profileUser.postsCount || 0}</strong> posts
            </div>
            <div className="profile-stat">
              <strong>{profileUser.followersCount || 0}</strong> followers
            </div>
            <div className="profile-stat">
              <strong>{profileUser.followingCount || 0}</strong> following
            </div>
          </div>
          <div className="profile-bio">
            <div className="profile-fullname">{profileUser.fullName}</div>
            {profileUser.bio && <div className="profile-bio-text">{profileUser.bio}</div>}
          </div>
        </div>
      </div>

      <div className="profile-posts-section">
        <div className="profile-posts-header">
          <span className="profile-posts-tab active">POSTS</span>
        </div>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="profile-posts-grid">
            {posts.map((post) => (
              <Link key={post._id} to={`/post/${post._id}`} className="profile-post-item">
                <img
                  src={post.image}
                  alt={post.caption}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div className="profile-post-overlay">
                  <span>❤️ {post.likes?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

