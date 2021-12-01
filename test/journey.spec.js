const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');

const chai = require('chai');
const expect = chai.expect;
const requester = require('./requester.spec');

describe('user journey', () => {
    it.only('Create user, Create car for user, Create ride for car and user', async () => {
        //ARRANGE

        //create car to post to the api
        let car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png'
        });

        //create user to post to the api
        let user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036'
        });

        //create ride to post to the api
        let ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
                address: 'Takspui 3',
                zipCode: '4706LL',
                city: 'Roosendaal'
            },
            reservationDateTime: new Date(),
            user: user
        });

        //ACT

        //register user via endpoint
        const createUserRes = await requester.post('/api/register').send(user);
        //expect succes
        expect(createUserRes).to.have.status(200);
        //save token from registration
        const token = createUserRes.body.token;

        //create car for user via endpoint
        const createCarRes = await requester.post('/api/car').send(car).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(createCarRes).to.have.status(200);
        //save just created car
        const createdCar = createCarRes.body;

        //create ride for just created car via endpoint
        const createRideRes = await requester.post(`/api/car/${createdCar._id}/ride`).send(ride).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(createRideRes).to.have.status(200);
        //save just created ride
        const createdRide = createRideRes.body;

        //get user via endpoint
        const getUserInfoRes = await requester.get('/api/user').set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getUserInfoRes).to.have.status(200);
        //save user
        const createdUser = getUserInfoRes.body;

        //get car via endpoint
        const getCarRes = await requester.get(`/api/car/${createdCar._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getCarRes).to.have.status(200);
        //save car
        const carWithRide = getCarRes.body;



        //ASSERT

        //test fields from user
        assert(createdUser.name === user.name);
        assert(createdUser.email === user.email);

        //test if car was added to user
        assert(createdUser.cars.length == 1);

        //test fields from car
        assert(carWithRide.name === car.name);
        assert(carWithRide.plate === car.plate);

        //test if ride was added to car
        assert(carWithRide.reservations.length === 1);

        //test if ride from car is the same as created ride
        assert(carWithRide.reservations[0].name === ride.name);

        //test fields from ride
        assert(createdRide.name === ride.name);
        assert(createdRide.destination.name === ride.destination.name)
        assert(createdRide.destination.address === ride.destination.address)

        //test if ride is created by user
        assert(createdRide.user.name === user.name);
        assert(createdRide.user.email === user.email);
    })
})