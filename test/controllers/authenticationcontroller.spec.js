const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

const chai = require('chai');
const expect = chai.expect;
const requester = require('../requester.spec');

describe('Authenticationcontroller', () => {
    let user, car, ride, token;

    beforeEach(async () => {
        //ARRANGE

        //create user for db
        user = new User({
            name: 'Bas Buijsen',
            email: 'test@gmail.com',
            phoneNumber: '0643680036',
            key: 'password'
        });
    })

    it('login valid', async () => {
        //ARRANGE

        //create logininfo
        const loginInfo = { email: user.email, password: user.key }

        const createUserRes = await requester.post('/api/register').send(user);

        //ACT

        //login via endpoint
        const loginRes = await requester.post('/api/login').send(loginInfo);
        //expect succes
        expect(loginRes).to.have.status(200);
        //save result
        const login = loginRes.body;


        //ASSERT

        //test if login has token and expiration
        assert(login.token != undefined);
        assert(login.expires != undefined);
    })

    it('login invalid', async () => {
        //ARRANGE

        //create logininfo
        const loginInfo = { email: user.email, password: '' }


        //ACT

        //login via endpoint
        const loginRes = await requester.post('/api/login').send(loginInfo);
        //save result
        const errorMessage = loginRes.body;


        //ASSERT

        //test if error message is correct
        assert(errorMessage.error === "Cannot read properties of null (reading 'key')");
    })

    it('register valid', async () => {
        //ARRANGE

        //create accountinfo
        const accountInfo = new User({ name: 'test', email: 'test@test.nl', phoneNumber: '238990872', key: 'password' });


        //ACT

        //register via endpoint
        const registerRes = await requester.post('/api/register').send(accountInfo);
        //expect succes
        expect(registerRes).to.have.status(200)
        //save result
        const registration = registerRes.body;


        //ASSERT

        //test if registration has token and expiration
        assert(registration.token != undefined);
        assert(registration.expires != undefined);
    })

    it('register invalid', async () => {
        //ARRANGE

        //create accountinfo
        const accountInfo = new User({ name: 'test', phoneNumber: '238990872' });


        //ACT

        //register via endpoint
        const registerRes = await requester.post('/api/register').send(accountInfo);
        //save result
        const errorMessage = registerRes.body;


        //ASSERT

        //test if error message is correct
        assert(errorMessage.error === 'user validation failed: email: User moet een email hebben, key: Path `key` is required.');
    })

    it('getUser valid', async () => {
        //ARRANGE
        //happens in beforeEach

        const createUserRes = await requester.post('/api/register').send(user);
        token = createUserRes.body.token;

        //ACT

        //get user via endpoint
        const userRes = await requester.get('/api/user').set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(userRes).to.have.status(200);
        //save result
        const userFromApi = userRes.body;


        //ASSERT

        //test if user has fields
        assert(userFromApi.name === user.name);
        assert(userFromApi.email === user.email);
    })

    it('getUser invalid', async () => {
        //ARRANGE
        //happens in beforeEach


        //ACT

        //get user via endpoint
        const userRes = await requester.get('/api/user');
        //expect failure
        expect(userRes).to.have.status(401);
        //save error
        const errorMessage = userRes.body;


        //ASSERT

        //test if error is correct
        assert(errorMessage.error === 'not authorized');
    })

    it('getUserById valid', async () => {
        //ARRANGE
        //happens in beforeEach

        const createUserRes = await requester.post('/api/register').send(user);
        token = createUserRes.body.token;

        let usr = new User({
            name: 'Bas Buijsen',
            email: 'test@gmail.com',
            phoneNumber: '0643680036',
            key: 'password'
        });

        usr = await usr.save();


        //ACT

        //get user by id via endpoint
        const userRes = await requester.get(`/api/user/${usr._id}`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(userRes).to.have.status(200);
        //save result
        const userById = userRes.body;


        //ASSERT

        //check if user has the same fields
        assert(userById.name === user.name);
        assert(userById.email === user.email);
    })

    it('getUserById invalid', async () => {
        //ARRANGE
        //happens in beforeEach

        const createUserRes = await requester.post('/api/register').send(user);
        token = createUserRes.body.token;

        //ACT

        //get user by id via endpoint
        const userRes = await requester.get(`/api/user/randomid`).set('Authorization', 'Bearer ' + token);
        //save error
        const errorMessage = userRes.body;


        //ASSERT

        //check if error has correct message
        assert(errorMessage.error === 'Cast to ObjectId failed for value "randomid" (type string) at path "_id" for model "user"');
    })

})