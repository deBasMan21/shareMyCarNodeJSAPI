const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');

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
    }
};