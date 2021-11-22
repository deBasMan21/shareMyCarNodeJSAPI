const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');

const jwt = require('node-jsonwebtoken');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

module.exports = {
    getCarForRide(req, res, next) {
        //find ride id
        const rideId = req.params.id;

        //find all cars with the specific ride in it
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
                //return rides
                res.send(ride);
            }).catch(next);
    },
    getCarsForUser(req, res, next) {
        //get token from headers
        const token = req.headers.authorization.substring(7);

        //verify token
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            //find user by id from the token
            User.findById(result.sub).then((user) => {
                //return cars from the user
                res.send(user.cars);
            });
        });
    },
    addCar(req, res, next) {
        //remove possible existing id from body
        delete req.body._id;

        //find token from headers
        const token = req.headers.authorization.substring(7);

        //prepare variabeles for entities
        const car = null;
        const user = null;

        //verify token
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            //find user by id from the token
            User.findById(result.sub).then((userResult) => {
                //save user to variable
                user = userResult;

                //create car entity with the body elements
                const entity = new Car(req.body);
                return entity.save()
            }).then((carResult) => {
                //save car to variable
                car = carResult;

                //add car to list of cars in user
                user.cars.push(carResult);
                return user.save()
            }).then(() => {
                //return new car
                res.send(car);
            });
        });
    }
};