// routes/chatDetail.js
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/:id', isLoggedIn, async (req, res) => {
  const currentUser = req.user;
  const otherUser = await User.findById(req.params.id);

  const messages = await Message.find({
    $or: [
      { sender: currentUser._id, receiver: otherUser._id },
      { sender: otherUser._id, receiver: currentUser._id }
    ]
  }).sort('createdAt');

  res.render('chatDetail', {
    currentUser,
    otherUser,
    messages
  });
});

module.exports = router;
