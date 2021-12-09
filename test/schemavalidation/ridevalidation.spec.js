const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

describe('Ride', () => {
    let car, ride, user;
    const validationMessage = 'ride validation failed';

    beforeEach((done) => {
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

        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '123456789',
            key: 'password'
        })

        ride.user = user;

        ride.save().then((ride) => {
            return user.save();
        }).then((user) => {
            done();
        }).catch((error) => {
            console.warn('Warning', error);
        })

    });

    it('ride has user', (done) => {
        Ride.findOne({ name: 'Maccie' }).then((ride) => {
            assert(ride.user.name === user.name)
            assert(ride.user.email === user.email)
            done();
        })
    });

    it('Ridename is required', (done) => {
        ride = new Ride({
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
        ride.save().then((err) => {
            assert(false == true);
            done();
        }).catch((err) => {
            assert(err._message === validationMessage);
            done();
        })
    })

    it('BeginDateTime is required', (done) => {
        ride = new Ride({
            name: 'Maccie',
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
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

    it('EndDateTime is required', (done) => {
        ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
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