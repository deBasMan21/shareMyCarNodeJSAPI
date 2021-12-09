const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

describe('Car', () => {
    let car, ride, user;

    beforeEach((done) => {
        car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png',
            reservations: []
        });

        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036',
            key: 'password'
        });

        ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
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

        ride.save().then(() => {
            return user.save();
        }).then(() => {
            return car.save()
        }).then((car) => {
            done();
        }).catch((error) => {
            console.warn('Warning', error);
        })

    });

    it('car has ride', (done) => {
        Car.findOne({ name: car.name }).populate({ path: 'reservations', schema: 'ride' })
            .then((car) => {
                assert(car.reservations.length === 1);
                assert(car.reservations[0].name === 'Maccie')
                assert(car.reservations[0].user.email === 'bbuijsen@gmail.com');
                done();
            }).catch((err) => {
                console.log(err);
            });
    });

    it('Carname is required', (done) => {
        const car = new Car({
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png'
        });
        car.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === 'car validation failed');
            done();
        })
    })

    it('Carplate is required', (done) => {
        const car = new Car({
            name: 'name',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png'
        });
        car.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === 'car validation failed');
            done();
        })
    })

    it('Carimage is required', (done) => {
        const car = new Car({
            name: 'name',
            plate: 'BK-171-K'
        });
        car.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === 'car validation failed');
            done();
        })
    })
})