const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/posts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { caption } = req.body;
    const post = new Post({
      user: req.user._id,
      image: `/uploads/posts/${req.file.filename}`,
      caption: caption || ''
    });

    await post.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username fullName avatar')
      .populate('likes', 'username fullName avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username fullName avatar' }
      });

    res.status(201).json({ post: populatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (feed)
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followingIds = [...user.following, req.user._id]; // Include own posts

    const posts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('user', 'username fullName avatar')
      .populate('likes', 'username fullName avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username fullName avatar' },
        options: { sort: { createdAt: -1 }, limit: 10 }
      })
      .limit(20);

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get explore posts (all posts)
router.get('/explore', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username fullName avatar')
      .populate('likes', 'username fullName avatar')
      .limit(50);

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username fullName avatar')
      .populate('likes', 'username fullName avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username fullName avatar' },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username fullName avatar')
      .populate('likes', 'username fullName avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username fullName avatar' }
      });

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete image file
    if (post.image && fs.existsSync(path.join(__dirname, '../', post.image))) {
      fs.unlinkSync(path.join(__dirname, '../', post.image));
    }

    // Delete comments
    await Comment.deleteMany({ post: post._id });

    // Remove from user's posts
    await User.findByIdAndUpdate(post.user, { $pull: { posts: post._id } });

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

