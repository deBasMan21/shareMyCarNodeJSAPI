const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationcontroller');
const friendscontroller = require('../controllers/friendscontroller');

const User = require('../src/User');
const CrudController = require('../controllers/crudcontroller');
const userCrudController = new CrudController(User);


//login route uses authenticationcontroller
router.post('/login', authenticationController.login);

//register route uses authenticationcontroller
router.post('/register', authenticationController.register);

//update route uses a crudcontroller
router.put('/user/:id', authenticationController.validate, userCrudController.update);

//delete route uses a crudcontroller
router.delete('/user/:id', authenticationController.validate, userCrudController.delete);

//get user and account information
router.get('/user', authenticationController.getUser);

router.get('/users', authenticationController.validate, authenticationController.getAllUsers);

//get user by id
router.get('/user/:id', authenticationController.validate, authenticationController.getUserById);

//request friend with user
router.post('/user/:friendId/friend', authenticationController.validate, friendscontroller.makeFriend);

//accept friendrequest with user
router.post('/user/:friendId/accept', authenticationController.validate, friendscontroller.acceptRequest);

//ignore friendrequest with user
router.delete('/user/:friendId/ignore', authenticationController.validate, friendscontroller.ignoreRequest);

//remove friend with user
router.delete('/user/:friendId/friend', authenticationController.validate, friendscontroller.removeFriend);

//get friends for user
router.get('/user/friends/all', authenticationController.validate, friendscontroller.getFriends);

//get friendrequests for user
router.get('/user/friends/requests', authenticationController.validate, friendscontroller.getRequests);

//get recommendations for friends
router.get('/user/friends/recommendations', authenticationController.validate, friendscontroller.getFriendRecommendations);

module.exports = router;