const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');

const jwt = require('node-jsonwebtoken');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

module.exports = {
    getCarForRide(req, res, next) {
        const rideId = req.params.id;

        Car.findOne({ "reservations": { "$in": [rideId] } })
            .populate({
                path: 'reservations',
                model: 'ride',
                populate: {
                    path: 'user',
                    model: 'user'
                }
            })
            .then((ride) => {
                res.send(ride);
            })
            .catch(next);
    },
    getCarsForUser(req, res, next) {
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            User.findById(result.sub).then((user) => {
                res.send(user.cars);
            });
        });
    },
    addCar(req, res, next) {
        delete req.body._id;
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            User.findById(result.sub).then((user) => {
                const entity = new Car(req.body);
                entity.save().then((car) => {
                    user.cars.push(car);
                    user.save().then((user) => {
                        res.send(car);
                    });
                });
            });
        });
    }
};