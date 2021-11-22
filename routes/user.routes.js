const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationcontroller');


//login route uses authenticationcontroller
router.post('/login', authenticationController.login);

//register route uses authenticationcontroller
router.post('/register', authenticationController.register);


module.exports = router;