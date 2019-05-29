var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/admin', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  userId: String,
  user: {
    userName: String,
    email: String,
  },
  friends: Array,
  blocked: Array,
  hidden: Array,
  mine: Array,
  multi: Array,
});

const setFriendsSchema = new mongoose.Schema({
  userId: String,
  friends: String,
})

const User = connection.model('User', userSchema);
const setFriends = connection.model('SetFriends', setFriendsSchema);

/* GET users. */
router.get('/', (req, res, next) => {
  User.find({}).exec((err, result) => res.status(201).json(result));
});

router.post('/saveUser', (req, res, next) => {
  const { userId, userName, email, friends, blocked, hidden, mine, multi } = req.query;
  const user = { userName, email };

  const mongooseUser = new User({ userId, user, friends, blocked, hidden, mine, multi });

  mongooseUser.save(err => {
    if (err) return res.status(400).json(err);
  });

  res.status(201).json();
});

router.post('/setFriends', (req, res, next) => {
  const { userId, friends } = req.query;

  const mongooseSetFriends = new setFriends({ userId, friends });

  mongooseSetFriends.save(err => {
    if (err) return res.status(400).json(err);
  });

  res.status(201).json();
});


module.exports = router;
