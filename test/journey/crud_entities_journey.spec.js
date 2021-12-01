const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

const chai = require('chai');
const expect = chai.expect;
const requester = require('../requester.spec');

describe('CRUD entities journey', () => {
    let token, car, user, ride;

    beforeEach(async () => {
        //ARRANGE

        //Create car for db
        car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-K',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png',
            reservations: []
        });

        //create user for db
        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036'
        });

        //create ride for db
        ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
                address: '',
                zipCode: '',
                city: ''
            },
            reservationDateTime: new Date()
        });

        //add user to ride
        ride.user = user;
        //add car to user
        user.cars.push(car);
        //add ride to car
        car.reservations.push(ride);

        //save all entities to db
        ride = await ride.save();
        car = await car.save();
        user = await user.save();

        //register user via endpoint
        const createUserRes = await requester.post('/api/register').send(user);
        //expect succes
        expect(createUserRes).to.have.status(200);
        //save token from registration
        token = createUserRes.body.token;
    })

    it('Create entities', async () => {
        //ARRANGE

        //create car to post to the api
        let car = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-A',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png'
        });

        //create user to post to the api
        let user = new User({
            name: 'Bas Buijsen',
            email: 'test@gmail.com',
            phoneNumber: '0643680036'
        });

        //create ride to post to the api
        let ride = new Ride({
            name: 'Maccie',
            beginDateTime: new Date('11-15-2021 12:00'),
            endDateTime: new Date('11-15-2021 15:00'),
            destination: {
                name: 'McDonalds Roosendaal',
                address: '',
                zipCode: '',
                city: ''
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

    it('Delete entities', async () => {
        //ARRANGE
        //happens in beforeEach

        //ACT

        //delete ride via endpoint
        const deleteRideRes = await requester.delete(`/api/car/${car._id}/ride/${ride._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(deleteRideRes).to.have.status(200);
        //assert if the deletion succeeded
        assert(deleteRideRes.body.succeeded === true);


        //delete car via endpoint
        const deleteCarRes = await requester.delete(`/api/car/${car._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(deleteRideRes).to.have.status(200);
        //assert if the deletion succeeded
        assert(deleteRideRes.body.succeeded === true);

    })

    it('Update entities', async () => {
        //ARRANGE

        //create object to update ride
        const updateFieldsRide = { name: 'updatedRideName' };
        //create object to update car
        const updateFieldsCar = { name: 'updatedCarName' }
        //create object to update location
        const updateFieldsLocation = { destination: { name: 'updatedLocationName' } }


        //ACT

        //update ride via endpoint
        const updateRideRes = await requester.put(`/api/ride/${ride._id}`).send(updateFieldsRide).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(updateRideRes).to.have.status(200);
        //save updated ride
        const updatedRide = updateRideRes.body;

        //update car via endpoint
        const updateCarRes = await requester.put(`/api/car/${car._id}`).send(updateFieldsCar).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(updateCarRes).to.have.status(200);
        //save updated car
        const updatedCar = updateCarRes.body;

        //update location via endpoint
        const updateLocationRes = await requester.put(`/api/ride/${ride._id}`).send(updateFieldsLocation).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(updateLocationRes).to.have.status(200);
        //save updated location in ride
        const updatedLocation = updateLocationRes.body;


        //ASSERT

        //test if fields from ride have been updated
        assert(updatedRide.name === updateFieldsRide.name);
        //test if other fields from ride havent been updated
        assert(updatedRide.destination.name === ride.destination.name);

        //test if fields from car have been updated
        assert(updatedCar.name === updateFieldsCar.name);
        //test if other fields from car havent been updated
        assert(updatedCar.plate === car.plate);


        //test if fields from location have been updated
        assert(updatedLocation.destination.name === updateFieldsLocation.destination.name);
        //test if other fields from car havent been updated
        assert(updatedLocation.destination.address === ride.destination.address);
    })

    it('Get entities', async () => {
        //ARRANGE
        //happens in beforeEach

        //ACT

        //get user via endpoint
        const getUserRes = await requester.get('/api/user').set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getUserRes).to.have.status(200);
        //save user
        const userFromApi = getUserRes.body;

        //get car via endpoint
        const getCarRes = await requester.get(`/api/car/${car._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getCarRes).to.have.status(200);
        //save car
        const carFromApi = getCarRes.body;

        //get ride and location via endpoint
        const getRideRes = await requester.get(`/api/ride/${ride._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getRideRes).to.have.status(200);
        //save ride and location
        const rideFromApi = getRideRes.body;


        //ASSERT

        //test if user is the same
        assert(userFromApi.name === user.name);
        assert(userFromApi.email === user.email);

        //test if car is the same
        assert(carFromApi.name === car.name);
        assert(carFromApi.plate === car.plate);

        //test if ride is the same
        assert(rideFromApi.name === ride.name);

        //test if location is the same
        assert(rideFromApi.destination.name === ride.destination.name)
        assert(rideFromApi.destination.address === ride.destination.address);
    })
})