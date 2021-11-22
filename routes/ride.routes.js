const express = require('express');
const router = express.Router();

const Ride = require('../src/Ride');
const CrudController = require('../controllers/crudcontroller');
const rideCrudController = new CrudController(Ride);

const carController = require('../controllers/carcontroller');
const ridecontroller = require('../controllers/ridecontroller');


//More advanced functions on ride
//get car for a specific ride
router.get('/:id/car', carController.getCarForRide);

//get all rides for user
router.get('', ridecontroller.getRidesForUser);

//CRUD on ride
//add ride
router.put('/:id', rideCrudController.update);

//get ride by id
router.get('/:id', rideCrudController.getById);


module.exports = router;