const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');
const mongoose = require('mongoose');

const jwt = require('node-jsonwebtoken');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

module.exports = {
    addRide(req, res, next) {
        const carId = req.params.id;
        const rideProps = req.body;
        delete rideProps._id;
        rideProps.reservationDateTime = Date.now();
        const token = req.headers.authorization.substring(7);

        let ride = null;

        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            User.findById(result.sub).then((user) => {
                rideProps.user = user._id;
                return Ride.create(rideProps);
            }).then(rideResult => {
                ride = rideResult;
                return Car.findById({ _id: carId });
            }).then(car => {
                car.reservations.push(ride);
                car.save();
                res.send(ride);
            }).catch(next);
        });


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
    getRidesForUser(req, res, next) {
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            User.findById(result.sub).then((user) => {
                console.log(user);
                return Ride.find({ user: user._id });
            }).then((rides) => {
                res.send(rides);
            });
        });
    }
};