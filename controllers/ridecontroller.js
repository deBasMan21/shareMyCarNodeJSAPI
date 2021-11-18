const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');

module.exports = {
    getRideById(req, res, next) {
        const id = req.params.id;
        Ride.findById({ _id: id })
            .then((ride) => { res.send(ride); })
            .catch(next);
    },
    addRide(req, res, next) {
        const carId = req.params.id;
        const rideProps = req.body;
        Ride.create(rideProps)
            .then(ride => {
                Car.findById({ _id: carId })
                    .then(car => {
                        car.reservations.push(ride);
                        car.save();
                        res.send({ succeeded: true });
                    })
                    .catch(next);
            })
            .catch(next);
    },
    removeRide(req, res, next) {
        const carId = req.params.carId;
        const rideId = req.params.rideId;
        Car.findById({ _id: carId })
            .then((car) => {
                const index = car.reservations.indexOf(rideId);
                car.reservations.splice(index);
                Ride.findByIdAndRemove({ _id: rideId }).then(() => {
                    res.send({ succeded: true });
                }).catch(next);
            }).catch(next);
    },
    updateRide(req, res, next) {
        const rideId = req.params.id;
        const rideProps = req.body;

        Ride.findByIdAndUpdate({ _id: rideId }, rideProps)
            .then(() => Ride.findById({ _id: rideId }))
            .then((ride) => res.send(ride))
            .catch(next);
    }
};