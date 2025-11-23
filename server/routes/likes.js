const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Like/Unlike post
router.post('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.some(like => like.toString() === req.user._id.toString());

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
      await post.save();
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      post.likes.push(req.user._id);
      await post.save();
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user liked a post
router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.some(like => like.toString() === req.user._id.toString());
    res.json({ liked: isLiked, likesCount: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

