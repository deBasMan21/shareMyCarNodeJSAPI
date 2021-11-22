const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');

module.exports = {
    addRide(req, res, next) {
        const carId = req.params.id;
        const rideProps = req.body;
        delete rideProps._id;
        rideProps.reservationDateTime = Date.now();

        Ride.create(rideProps)
            .then(ride => {
                Car.findById({ _id: carId })
                    .then(car => {
                        car.reservations.push(ride);
                        car.save();
                        res.send(ride);
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
    }
};