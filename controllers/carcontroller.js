const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const neo = require('../neo');

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
            User.findById(result.sub).populate('cars').then((user) => {
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
        let car = null;
        let user = null;

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
            }).catch(next);
        });
    },
    async getById(req, res, next) {
        //find car entity by id in the url
        Car.findById({ _id: req.params.id }).then((entity) => {
            //get token from headers
            const token = req.headers.authorization.substring(7);

            //verify token
            jwt.verify(token, RSA_PRIVATE_KEY, {
                algorithms: ['RS256']
            }, (err, result) => {
                //find user by id from token
                User.findById(result.sub).then(async (user) => {
                    //set owner attribute false by default
                    entity.isOwner = false;

                    user.cars.forEach((car) => {
                        //test if car is owned by user
                        if (car._id.toString() === entity._id.toString()) {
                            //set owner attribute to true
                            entity.isOwner = true;
                        }
                    })
                    //send entity with owner attribute back
                    res.send(entity);

                    //loop trough users cars
                }).catch(next);
            });
        }).catch(next);

    },
    async getAllCars(req, res, next) {
        let carlist = [];

        //get token from headers
        const token = req.headers.authorization.substring(7);

        //verify token
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {

            const session = neo.session();
            const neoresult = await session.run(neo.getFriends, { id: result.sub });
            const items = neoresult.records[0].get('userIds')

            User.find({ _id: { $in: items } }, { cars: 1 }).populate('cars').then((users) => {
                users.forEach((user) => {
                    carlist.push(...user.cars);
                })
                carlist.forEach((car) => {
                    car.isOwner = false;
                })
                res.send(carlist);
            }).catch(next);
        });
    }
};