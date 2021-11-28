const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationcontroller');
const friendscontroller = require('../controllers/friendscontroller');


//login route uses authenticationcontroller
router.post('/login', authenticationController.login);

//register route uses authenticationcontroller
router.post('/register', authenticationController.register);

//get user and account information
router.get('/user', authenticationController.getUser);

//get user by id
router.get('/user/:id', authenticationController.validate, authenticationController.getUserById);

//make friend with user
router.post('/user/:friendId/friend', authenticationController.validate, friendscontroller.makeFriend);

//get friends for user
router.get('/user/friends/all', authenticationController.validate, friendscontroller.getFriends);

//get recommendations for friends
router.get('/user/friends/recommendations', authenticationController.validate, friendscontroller.getFriendRecommendations);

module.exports = router;