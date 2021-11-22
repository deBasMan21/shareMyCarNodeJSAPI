const express = require('express');
const router = express.Router();

const Car = require('../src/Car');
const CrudController = require('../controllers/crudcontroller');
const carCrudController = new CrudController(Car);

const rideController = require('../controllers/ridecontroller');
const carcontroller = require('../controllers/carcontroller');


// CRUD functions on car
//add car
router.post('', carcontroller.addCar);

//update car
router.put('/:id', carCrudController.update);

//delete car
router.delete('/:id', carCrudController.delete);

//get car by id
router.get('/:id', carCrudController.getById);

//get all cars for user
router.get('', carcontroller.getCarsForUser);

//More advanced functions on car with rides
//add ride and add it to car
router.post('/:id/ride', rideController.addRide);

//remove ride and remove from car
router.delete('/:carId/ride/:rideId', rideController.removeRide);


module.exports = router;