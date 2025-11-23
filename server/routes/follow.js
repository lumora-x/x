const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Follow/Unfollow user
router.post('/:userId', auth, async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.some(
      id => id.toString() === req.params.userId
    );

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.userId }
      });
      await User.findByIdAndUpdate(req.params.userId, {
        $pull: { followers: req.user._id }
      });
      res.json({ message: 'User unfollowed', following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.params.userId }
      });
      await User.findByIdAndUpdate(req.params.userId, {
        $push: { followers: req.user._id }
      });
      res.json({ message: 'User followed', following: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

