const carcontroller = require('../controllers/carcontroller');

module.exports = (app) => {
    app.post('/api/car', carcontroller.addCar);
    app.put('/api/car/:id', carcontroller.updateCar);
    app.delete('/api/car/:id', carcontroller.deleteCar);
    app.get('/api/car/:id', carcontroller.getCarById);
    app.get('/api/car', carcontroller.getAllCars);
}