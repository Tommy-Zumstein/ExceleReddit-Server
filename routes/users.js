const firebaseSDK = require('firebase');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/admin', {
  useNewUrlParser: true
});

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


/* Login to firebase. */
router.get('/login', (req, res, next) => {
  const { email, password } = req.query;

  firebaseSDK.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
      const { uid, refreshToken } = result.user;
      User.find({ userId: uid }).exec((err, dbResult) => {
        if (err) res.status(400).json(err);
        const user = dbResult[0];
        res.status(200).json({ user, refreshToken });
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

/* verify users token to login */
router.get('/verifyToken', (req, res, next) => {
  const { token } = req.query;

  // TODO: finish this 
  // firebaseSDK.auth().signInWithCustomToken(token)
  //   .then(result => {
  //     const { uid, refreshToken } = result.user;
  //     User.find({ userId: uid }).exec((err, dbResult) => {
  //       if (err) res.status(400).json(err);
  //       const user = dbResult[0];
  //       res.status(200).json({ user, refreshToken });
  //     });
  //   })
  //   .catch(err => {
  //     res.status(400).json(err);
  //   });
  res.status(400).json({ message: '/verifyToken is not yet implemented.' });
});

/* GET users. */
router.get('/users', (req, res, next) => {
  User.find({}).exec((err, result) => res.status(200).json(result));
});

/* GET user. */
router.get('/getUser', (req, res, next) => {
  const {
    userId
  } = req.query;

  User.find({
    userId
  }).exec((err, result) => {
    if (!err) res.status(200).json(result[0]);
    else res.status(400).json(err);
  });
});

/* GET user's Friends. */
router.get('/getFriends', (req, res, next) => {
  const {
    userId
  } = req.query;

  User.find({
    userId
  }).exec((err, result) => {
    if (!err) res.status(200).json({
      friends: result.friends
    });
    else res.status(400).json(err);
  });
});

/* Create user. */
router.post('/createUser', (req, res, next) => {
  const { user, password, friends, blocked, hidden, mine, multi } = req.body;

  firebaseSDK.auth().createUserWithEmailAndPassword(user.email, password)
    .then(result => {
      const { uid } = result.user;
      const userId = uid;

      const mongooseUser = new User({
        userId, user, friends, blocked, hidden, mine, multi
      });

      mongooseUser.save(err => {
        if (err) return res.status(400).json(err);

        // TODO: abstract this out to prevent DRY
        firebaseSDK.auth().signInWithEmailAndPassword(user.email, password)
          .then(result => {
            const { uid, refreshToken } = result.user;

            User.find({ userId: uid }).exec((err, dbResult) => {
              if (err) res.status(400).json(err);

              const user = dbResult[0];

              res.status(200).json({ user, refreshToken });
            });
          })
          .catch(err => {
            res.status(400).json(err);
          });
      });
    })
    .catch(err => res.status(400).json(err));
});

/* adds friends to a user. */
router.post('/setFriends', (req, res, next) => {
  const {
    userId,
    friends
  } = req.query;

  const mongooseSetFriends = new setFriends({
    userId,
    friends
  });

  mongooseSetFriends.save(err => {
    if (err) return res.status(400).json(err);
  });

  res.status(200).json();
});



module.exports = router;