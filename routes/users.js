var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(User);
});

module.exports = router;
