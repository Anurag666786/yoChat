// routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Chat page with recent chats
router.get('/', isLoggedIn, async (req, res) => {
  const currentUser = req.user;

  // Get all users except current
  const users = await User.find({ _id: { $ne: currentUser._id } });

  // Get latest messages with each user
  const recentChats = await Promise.all(users.map(async user => {
    const lastMessage = await Message.findOne({
      $or: [
        { sender: currentUser._id, receiver: user._id },
        { sender: user._id, receiver: currentUser._id }
      ]
    }).sort({ createdAt: -1 });
    return { user, lastMessage };
  }));

  res.render('chat', { currentUser, recentChats });
});

module.exports = router;
