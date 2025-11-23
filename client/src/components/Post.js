import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import './Post.css';

const Post = ({ post, onUpdate }) => {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post && currentUser) {
      // Check if current user liked the post
      const currentUserId = currentUser.id || currentUser._id;
      setIsLiked(post.likes?.some(like => {
        const likeId = typeof like === 'object' ? (like._id || like.id) : like;
        return likeId === currentUserId || likeId?.toString() === currentUserId?.toString();
      }) || false);
      setLikesCount(post.likes?.length || 0);
      setComments(post.comments || []);
    }
  }, [post, currentUser]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/likes/${post._id}`);
      setIsLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || loading) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/comments', {
        postId: post._id,
        text: commentText
      });
      setComments([response.data.comment, ...comments]);
      setCommentText('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now - postDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  if (!post) return null;

  return (
    <article className="post">
      <header className="post-header">
        <Link to={`/profile/${post.user._id}`} className="post-user">
          <img
            src={post.user.avatar || 'https://via.placeholder.com/32'}
            alt={post.user.username}
            className="post-avatar"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/32';
            }}
          />
          <span className="post-username">{post.user.username}</span>
        </Link>
        <button className="post-more">
          <FiMoreHorizontal size={24} />
        </button>
      </header>

      <div className="post-image-container">
        <img
          src={post.image}
          alt={post.caption}
          className="post-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600';
          }}
        />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button onClick={handleLike} className="post-action-btn">
            {isLiked ? (
              <FaHeart size={24} color="#ed4956" />
            ) : (
              <FiHeart size={24} />
            )}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="post-action-btn"
          >
            <FiMessageCircle size={24} />
          </button>
          <button className="post-action-btn">
            <FiSend size={24} />
          </button>
        </div>
        <button className="post-action-btn">
          <FiBookmark size={24} />
        </button>
      </div>

      <div className="post-content">
        {likesCount > 0 && (
          <div className="post-likes">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </div>
        )}

        <div className="post-caption">
          <Link to={`/profile/${post.user._id}`} className="post-username">
            {post.user.username}
          </Link>
          <span>{post.caption}</span>
        </div>

        {comments.length > 0 && !showComments && (
          <button
            className="post-view-comments"
            onClick={() => setShowComments(true)}
          >
            View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </button>
        )}

        {showComments && (
          <div className="post-comments">
            {comments.map((comment) => (
              <div key={comment._id} className="post-comment">
                <Link to={`/profile/${comment.user._id}`} className="comment-username">
                  {comment.user.username}
                </Link>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="post-time">{formatTime(post.createdAt)}</div>
      </div>

      <form onSubmit={handleComment} className="post-comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="post-comment-input"
        />
        <button
          type="submit"
          disabled={!commentText.trim() || loading}
          className="post-comment-submit"
        >
          Post
        </button>
      </form>
    </article>
  );
};

export default Post;

