var uuidv4 = require('uuid/v4');

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
router.get('/users', (req, res, next) => {
  User.find({}).exec((err, result) => res.status(200).json(result));
});

/* GET user. */
router.get('/getUser', (req, res, next) => {
  const { userId } = req.query;

  User.find({ userId }).exec((err, result) => {
    if (!err) res.status(200).json(result[0]);
    else res.status(400).json(err);
  });
});

/* GET user's Friends. */
router.get('/getFriends', (req, res, next) => {
  const { userId } = req.query;

  User.find({ userId }).exec((err, result) => {
    if (!err) res.status(200).json({ friends: result.friends });
    else res.status(400).json(err);
  });
});

/* Create user. */
router.post('/createUser', (req, res, next) => {
  const { user, friends, blocked, hidden, mine, multi } = req.body;

  const userId = uuidv4();
  const mongooseUser = new User({ userId, user, friends, blocked, hidden, mine, multi });

  mongooseUser.save(err => {
    if (err) return res.status(400).json(err);
  });

  res.status(200).json({ userId });
});

/* adds friends to a user. */
router.post('/setFriends', (req, res, next) => {
  const { userId, friends } = req.query;

  const mongooseSetFriends = new setFriends({ userId, friends });

  mongooseSetFriends.save(err => {
    if (err) return res.status(400).json(err);
  });

  res.status(200).json();
});



module.exports = router;
