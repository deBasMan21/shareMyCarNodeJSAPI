const carcontroller = require('../controllers/carcontroller');
const ridecontroller = require('../controllers/ridecontroller');

module.exports = (app) => {
    app.post('/api/car', carcontroller.addCar);
    app.put('/api/car/:id', carcontroller.updateCar);
    app.delete('/api/car/:id', carcontroller.deleteCar);
    app.get('/api/car/:id', carcontroller.getCarById);
    app.get('/api/car', carcontroller.getAllCars);

    app.post('/api/car/:id/ride', ridecontroller.addRide);
    app.delete('/api/car/:carId/ride/:rideId', ridecontroller.removeRide);

    app.get('/api/ride/:id/car', carcontroller.getCarForRide);

    app.put('/api/ride/:id', ridecontroller.updateRide);
    app.get('/api/ride/:id', ridecontroller.getRideById);
}