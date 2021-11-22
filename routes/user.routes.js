const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationcontroller');


//login route uses authenticationcontroller
router.post('/login', authenticationController.login);

//register route uses authenticationcontroller
router.post('/register', authenticationController.register);

//get user and account information
router.get('/user', authenticationController.getUser);


module.exports = router;