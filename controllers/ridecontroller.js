const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');
const mongoose = require('mongoose');

const jwt = require('node-jsonwebtoken');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

module.exports = {
    addRide(req, res, next) {
        //find carid, ridedetails and put de reservationdatetime
        const carId = req.params.id;
        const rideProps = req.body;
        rideProps.reservationDateTime = Date.now();

        //remove possible id
        delete rideProps._id;
        //find token
        const token = req.headers.authorization.substring(7);

        let ride = null;

        //verify token
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            //find user by the id from the token
            User.findById(result.sub).then((user) => {
                //add userid to ride
                rideProps.user = user._id;
                return Ride.create(rideProps);
            }).then(rideResult => {
                //save result to ride variable
                ride = rideResult;
                //find car by id
                return Car.findById({ _id: carId });
            }).then(car => {
                //add ride to car
                car.reservations.push(ride);
                car.save();
                res.send(ride);
            }).catch(next);
        });


    },
    removeRide(req, res, next) {
        //find ids in url
        const carId = req.params.carId;
        const rideId = req.params.rideId;

        //search car by id
        Car.findById({ _id: carId })
            .then((car) => {
                //find index of ride
                const index = car.reservations.indexOf(rideId);
                //remove specific ride from reservations of the car
                car.reservations.splice(index);
                //remove ride from collection
                Ride.findByIdAndRemove({ _id: rideId }).then(() => {
                    //return succes
                    res.send({ succeded: true });
                });
            }).catch(next);
    },
    getRidesForUser(req, res, next) {
        //get token from headers
        const token = req.headers.authorization.substring(7);

        //verify token
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            //find user by the id from the token
            User.findById(result.sub).then((user) => {
                //find rides from user
                return Ride.find({ user: user._id, beginDateTime: { $gte: new Date() } });
            }).then((rides) => {
                //return rides
                res.send(rides);
            }).catch(next);
        });
    }
};