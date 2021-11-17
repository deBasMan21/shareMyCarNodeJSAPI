const Car = require('../src/Car');

module.exports = {
    addCar(req, res, next) {
        const carProps = req.body;
        Car.create(carProps)
            .then(car => res.send(car))
            .catch(next);

    },
    deleteCar(req, res, next) {
        const id = req.params.id;
        Car.findByIdAndDelete({ _id: id })
            .then((car) => { console.log(car); res.send(car) })
            .catch(next);
    },
    updateCar(req, res, next) {
        const id = req.params.id;
        const carProps = req.body;

        Car.findByIdAndUpdate({ _id: id }, carProps)
            .then(() => Car.findById({ _id: id }))
            .then((car) => res.send(car))
            .catch(next);
    },
    getCarById(req, res, next) {
        const id = req.params.id;

        Car.findById({ _id: id })
            .then((car) => res.send(car))
            .catch(next);
    },
    getAllCars(req, res, next) {
        Car.find()
            .then((cars) => res.send(cars))
            .catch(next);
    }
};