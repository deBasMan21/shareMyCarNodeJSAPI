const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const { userInfo } = require('os');

describe('Car', () => {
    let car, ride, user;
    const validationMessage = 'ride validation failed';

    it('Location name is required', (done) => {
        ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                address: 'Takspui 3',
                zipCode: '4706LL',
                city: 'Roosendaal'
            },
            reservationDateTime: new Date()
        });

        ride.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === validationMessage);
            done();
        })
    })
})