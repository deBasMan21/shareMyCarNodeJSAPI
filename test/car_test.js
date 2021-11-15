const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');

describe('Car', () => {
    let car, ride, user;

    beforeEach((done) => {
        car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png'
        });

        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036'
        });

        ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 12:00'),
            beginDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
                address: 'Takspui 3',
                zipCode: '4706LL',
                city: 'Roosendaal'
            },
            reservationDateTime: new Date()
        });

        ride.user = user;
        user.cars.push(car);
        car.reservations.push(ride);

        Promise.all([car.save(), user.save(), ride.save()]).then((result) => {
            done();
        });

    });

    it('car has ride', (done) => {
        Car.findOne({ name: 'Tesla model 3' })
            .populate({
                path: 'reservations',
                model: 'ride',
                populate: {
                    path: 'user',
                    model: 'user'
                }
            })
            .then((car) => {
                assert(car.reservations.length === 1);
                assert(car.reservations[0].user.email === 'bbuijsen@gmail.com');
                done();
            });
    });
})