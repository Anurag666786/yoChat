// config/passport.js
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');

module.exports = function(passport) {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
