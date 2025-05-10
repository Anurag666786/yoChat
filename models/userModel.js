// models/userModel.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profilePic: {
    url: String,
    public_id: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically handles password hashing, salting, etc.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
