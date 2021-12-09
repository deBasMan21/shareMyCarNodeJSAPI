const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

const chai = require('chai');
const expect = chai.expect;
const requester = require('../requester.spec');

describe('Carcontroller', () => {
    let car, ride, user, token;

    it('getCarForRide valid', async () => {
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
            phoneNumber: '0643680036',
            key: 'password'
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

        //ACT

        //get car for ride via endpoint
        const getCarRes = await requester.get(`/api/ride/${ride._id}/car`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getCarRes).to.have.status(200);
        //save car
        const carForRide = getCarRes.body;


        //ASSERT

        //test if car has correct fields
        assert(carForRide.name === car.name);
        assert(carForRide.plate === car.plate);
    })

    it('getCarForRide invalid', async () => {
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
            phoneNumber: '0643680036',
            key: 'password'
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

        //ACT

        //get car for ride via endpoint
        const getCarRes = await requester.get(`/api/ride/randomId/car`).set('Authorization', 'Bearer ' + token);
        //save errorMessage
        const errorMessage = getCarRes.body;


        //ASSERT

        //test if error has correct value
        assert(errorMessage.error === 'Cast to ObjectId failed for value "randomId" (type string) at path "reservations" for model "car"');
    })

    it('addCar valid', async () => {
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
            phoneNumber: '0643680036',
            key: 'password'
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

        //create car for request
        createCar = new Car({
            name: 'Tesla model 3',
            plate: 'BK-171-B',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png',
            reservations: []
        });


        //ACT

        //add car via endpoint
        const addCarRes = await requester.post('/api/car').send(createCar).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(addCarRes).to.have.status(200);
        //save result
        const newCar = addCarRes.body;


        //ASSERT

        //test if fields are correct
        assert(newCar.name === createCar.name);
        assert(newCar.plate === createCar.plate);
    })

    it('addCar invalid', async () => {
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
            phoneNumber: '0643680036',
            key: 'password'
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

        //create car for request
        createCar = new Car({
            plate: 'BK-171-B',
            imageSrc: 'https://www.pngall.com/wp-content/uploads/7/White-Tesla-Electric-Car-PNG-Picture.png',
            reservations: []
        });


        //ACT

        //add car via endpoint
        const addCarRes = await requester.post('/api/car').send(createCar).set('Authorization', 'Bearer ' + token);
        //save result
        const errorMessage = addCarRes.body;


        //ASSERT

        //test if fields are correct
        assert(errorMessage.error === 'car validation failed: name: De auto moet een naam hebben')
    })

    it('getById valid', async () => {
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
            phoneNumber: '0643680036',
            key: 'password'
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


        //ACT

        //get car via endpoint
        const getCarRes = await requester.get(`/api/car/${car._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(getCarRes).to.have.status(200);
        //save result
        const carFromApi = getCarRes.body;


        //ASSERT

        //test if fields are correct
        assert(carFromApi.name === car.name);
        assert(carFromApi.plate === car.plate);
    })

    it('getById invalid', async () => {
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
            phoneNumber: '0643680036',
            key: 'password'
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


        //ACT

        //get car via endpoint
        const getCarRes = await requester.get(`/api/car/randomid`).set('Authorization', 'Bearer ' + token);
        //save result
        const errorMessage = getCarRes.body;


        //ASSERT

        //test if fields are correct
        assert(errorMessage.error === `Cast to ObjectId failed for value "{ _id: 'randomid' }" (type Object) at path "_id" for model "car"`);
    })
})