// models/userModel.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profileImage: {
    url: String,
    filename: String
  }
});

userSchema.plugin(passportLocalMongoose); // adds username, hash & salt

module.exports = mongoose.model('User', userSchema);
