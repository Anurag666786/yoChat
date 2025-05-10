// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const socketIO = require('socket.io');
const io = socketIO(http);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Session
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

// Passport setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/auth'));
app.use('/chat', require('./routes/chat'));
app.use('/user', require('./routes/user'));

// Socket.IO setup
io.on('connection', socket => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
