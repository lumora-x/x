import React, { useState } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import './CreatePost.css';

const CreatePost = ({ onClose, onPostCreated }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);

      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (onPostCreated) {
        onPostCreated(response.data.post);
      }
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-post-header">
          <h2>Create new post</h2>
          <button onClick={onClose} className="close-btn">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {!preview ? (
            <div className="create-post-upload">
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="upload-label">
                <div className="upload-icon">📷</div>
                <p>Select photos and videos here</p>
                <button type="button" className="upload-button">
                  Select from computer
                </button>
              </label>
            </div>
          ) : (
            <div className="create-post-preview">
              <img src={preview} alt="Preview" />
              <div className="create-post-caption-section">
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="caption-input"
                  rows="4"
                />
                {error && <div className="error-message">{error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="share-button"
                >
                  {loading ? 'Sharing...' : 'Share'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

