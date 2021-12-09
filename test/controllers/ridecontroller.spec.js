const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

const chai = require('chai');
const expect = chai.expect;
const requester = require('../requester.spec');

describe('Ridecontroller', () => {
    let user, token, ride, car;
    beforeEach(async () => {
        //create user for db
        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036',
            key: 'password'
        });

        //create ride for db
        ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2200 12:00'),
            endDateTime: new Date('11-15-2200 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
                address: '',
                zipCode: '',
                city: ''
            },
            reservationDateTime: new Date()
        });

        //Create car for db
        car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png',
            reservations: []
        });

        //add user to ride
        ride.user = user;
        //add car to user
        user.cars.push(car);
        //add ride to car
        car.reservations.push(ride);

        //save all entities to db
        user = await user.save();
        ride = await ride.save();
        car = await car.save();

        //register user via endpoint
        const createUserRes = await requester.post('/api/register').send(user);
        //expect succes
        expect(createUserRes).to.have.status(200);
        //save token from registration
        token = createUserRes.body.token;
    })

    it('addRide valid', async () => {
        //ARRANGE

        //create ride to insert
        let createRide = new Ride({
            name: 'Test',
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'test',
                address: '',
                zipCode: '',
                city: ''
            },
            reservationDateTime: new Date()
        });


        //ACT

        //use endpoint to addride
        const addRideRes = await requester.post(`/api/car/${car._id}/ride`).send(createRide).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(addRideRes).to.have.status(200);
        //save added ride
        const newRide = addRideRes.body;

        //ASSERT 

        //test if ride has all values
        assert(newRide.name === createRide.name)
        assert(newRide.destination.name === createRide.destination.name);
    })

    it('addRide invalid', async () => {
        //ARRANGE

        //create ride to insert
        let createRide = new Ride({
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'test',
                address: '',
                zipCode: '',
                city: ''
            },
            reservationDateTime: new Date()
        });


        //ACT

        //use endpoint to addride
        const addRideRes = await requester.post(`/api/car/${car._id}/ride`).send(createRide).set('Authorization', 'Bearer ' + token);
        //save errormessage
        const error = addRideRes.body

        //ASSERT

        //test if error is correct
        assert(error.error === 'ride validation failed: name: De rit moet een naam hebben');
    })

    it('removeRide valid', async () => {
        //ARRANGE
        //happens in beforeEach

        //ACT

        //remove ride via endpoint
        const deleteRideRes = await requester.delete(`/api/car/${car._id}/ride/${ride._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(deleteRideRes).to.have.status(200);
        //save result
        const deletedRide = deleteRideRes.body;

        //ASSERT

        //test if value is true
        assert(deletedRide.succeeded === true);
    })

    it('removeRide invalid', async () => {
        //ARRANGE
        //happens in beforeEach

        //ACT

        //remove ride via endpoint
        const deleteRideRes = await requester.delete(`/api/car/randomid/ride/${ride._id}`).set('Authorization', 'Bearer ' + token);
        //save errorMessage
        const deletedRide = deleteRideRes.body;


        //ASSERT

        //test if value is true
        assert(deletedRide.error === `Cast to ObjectId failed for value "{ _id: 'randomid' }" (type Object) at path "_id" for model "car"`);
    })
})