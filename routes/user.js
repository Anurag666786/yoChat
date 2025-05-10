// routes/user.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/userModel');
const multer = require('multer');
const { cloudinary, storage } = require('../config/cloudinary');

const upload = multer({ storage });

// REGISTER
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });

    if (req.file) {
      user.profilePic = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect('/chat');
    });
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

// LOGIN
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  res.redirect('/chat');
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

module.exports = router;
