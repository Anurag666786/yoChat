// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const { cloudinary, storage } = require('../config/cloudinary');
const User = require('../models/userModel');
const upload = multer({ storage });

// Show register page
router.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error') });
});

// Register user
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, password } = req.body;
    const profileImage = req.file ? {
      url: req.file.path,
      filename: req.file.filename
    } : {};

    const newUser = new User({ username, profileImage });
    await User.register(newUser, password); // uses passport-local-mongoose
    res.redirect('/login');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/register');
  }
});

// Show login page
router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

// Login logic
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

module.exports = router;
