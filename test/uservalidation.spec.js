const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const { userInfo } = require('os');

describe('Car', () => {
    let car, ride, user;
    const validationMessage = 'user validation failed';

    beforeEach((done) => {
        car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png'
        });

        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '123456789'
        })
        user.cars.push(car);

        car.save().then((car) => {
            return user.save();
        }).then((user) => {
            done();
        }).catch((error) => {
            console.warn('Warning', error);
        })

    });

    it('user has cars', (done) => {
        User.findOne({ name: user.name }).populate({
            path: 'cars',
            model: 'car'
        }).then((user) => {
            assert(user.cars.length === 1)
            assert(user.cars[0].name === car.name)
            done();
        })
    });

    it('User name is required', (done) => {
        user = new User({
            email: 'bbuijsen@gmail.com',
            phoneNumber: '123456789'
        })
        user.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === validationMessage);
            done();
        })
    })

    it('User email is required', (done) => {
        user = new User({
            name: 'Bas Buijsen',
            phoneNumber: '123456789'
        })
        user.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === validationMessage);
            done();
        })
    })
})