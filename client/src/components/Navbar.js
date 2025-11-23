import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiSearch, FiPlusSquare, FiUser, FiLogOut } from 'react-icons/fi';
import CreatePost from './CreatePost';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Lunagram
        </Link>

        <div className="navbar-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            onFocus={() => navigate('/explore')}
          />
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FiHome size={24} />
          </Link>
          <Link to="/explore" className="nav-link">
            <FiSearch size={24} />
          </Link>
          <Link to="/" className="nav-link" onClick={(e) => {
            e.preventDefault();
            handleCreatePost();
          }}>
            <FiPlusSquare size={24} />
          </Link>
          <div className="nav-user" onClick={() => setShowMenu(!showMenu)}>
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.username}
              className="nav-avatar"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/32';
              }}
            />
            {showMenu && (
              <div className="user-menu">
                <Link to={`/profile/${user?.id}`} onClick={() => setShowMenu(false)}>
                  <FiUser /> Profile
                </Link>
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
            window.location.href = '/';
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;

