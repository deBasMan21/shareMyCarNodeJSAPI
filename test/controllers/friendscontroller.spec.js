const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../../src/User');
const Ride = require('../../src/Ride');
const Car = require('../../src/Car');

const chai = require('chai');
const expect = chai.expect;
const requester = require('../requester.spec');

const neo = require('../../neo');

describe('Friendscontroller', () => {
    let user, userFriend, token, userFriendFriend;
    beforeEach(async () => {
        //create user
        user = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036',
            key: '$2b$10$C/k9KGaTpXf0LGcVEB75Ye4MROlkg6FSFF6EO3KYerT65m7HuCQGu'
        });

        //create friend for user
        userFriend = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036',
            key: '$2b$10$C/k9KGaTpXf0LGcVEB75Ye4MROlkg6FSFF6EO3KYerT65m7HuCQGu'
        });

        userFriendFriend = new User({
            name: 'Bas Buijsen',
            email: 'bbuijsen@gmail.com',
            phoneNumber: '0643680036',
            key: '$2b$10$C/k9KGaTpXf0LGcVEB75Ye4MROlkg6FSFF6EO3KYerT65m7HuCQGu'
        });

        //save them to db
        user = await user.save();
        userFriend = await userFriend.save();
        userFriendFriend = await userFriendFriend.save();


        //create logininfo for user to get token
        const loginInfo = { email: user.email, password: 'password' };

        //login user via endpoint
        const createUserRes = await requester.post('/api/login').send(loginInfo);
        //expect succes
        expect(createUserRes).to.have.status(200);
        //save token from registration
        token = createUserRes.body.token;


        //make session
        const session = neo.session();
        //empty db
        await session.run(neo.emptyDB, {});
    })

    it('makeFriend valid', async () => {


        //ACT

        //add friends via endpoint
        const friendRes = await requester.post(`/api/user/${userFriend._id}/friend`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(friendRes).to.have.status(200);
        //save result
        const friendMade = friendRes.body;


        //ASSERT

        //test if friend was made
        assert(friendMade.succes == true)
    })

    it('makeFriend invalid', async () => {


        //ACT

        //add friends via endpoint
        const friendRes = await requester.post(`/api/user/randomId/friend`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(friendRes).to.have.status(400);
        //save result
        const errorMessage = friendRes.body;


        //ASSERT

        //test if friend was made
        assert(errorMessage.error == 'Cast to ObjectId failed for value "randomId" (type string) at path "_id" for model "user"');
    })

    it('getFriends valid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend
        await session.run(neo.makeFriend, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //get friends via endpoint
        const friendRes = await requester.get('/api/user/friends/all').set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(friendRes).to.have.status(200);
        //save result
        const friendFromApi = friendRes.body;


        //ASSERT

        //test if users exists
        assert(friendFromApi.length === 1);
        assert(friendFromApi[0].name === userFriend.name);
    })

    it('getFriends invalid', async () => {


        //ACT

        //get friends via endpoint
        const friendRes = await requester.get('/api/user/friends/all').set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(friendRes).to.have.status(200);
        //save result
        const friendFromApi = friendRes.body;


        //ASSERT

        //test if users exists
        assert(friendFromApi.length === 0);
    })

    it('getFriendRecommendations valid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend
        await session.run(neo.makeFriend, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });
        //run query to make friend for that friend
        await session.run(neo.makeFriend, { user1Id: userFriend._id.toString(), user2Id: userFriendFriend._id.toString() });


        //ACT

        //get recommendations for friend
        const recomRes = await requester.get('/api/user/friends/recommendations').set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(recomRes).to.have.status(200);
        //save result
        const recommendations = recomRes.body;


        //ASSERT

        //test if friend is returned
        assert(recommendations.length === 1);
        //test if name is the same
        assert(recommendations[0].name === userFriendFriend.name);
    })

    it('getFriendRecommendations invalid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend
        await session.run(neo.makeFriend, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });
        //run query to make friend for that friend
        await session.run(neo.makeFriend, { user1Id: userFriend._id.toString(), user2Id: userFriendFriend._id.toString() });


        //ACT

        //get recommendations for friend
        const recomRes = await requester.get('/api/user/friends/recommendations');
        //expect failure
        expect(recomRes).to.have.status(401);
        //save error
        const error = recomRes.body;


        //ASSERT

        //test correct error message
        assert(error.error === 'not authorized');
    })

    it('removeFriend valid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend
        await session.run(neo.makeFriend, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //remove friend via endpoint
        const removeRes = await requester.delete(`/api/user/${userFriend._id}/friend`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(removeRes).to.have.status(200);
        //save result
        const remove = removeRes.body;


        //ASSERT

        //test if removal succeeded
        assert(remove.succes === true);
    })

    it('removeFriend invalid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend
        await session.run(neo.makeFriend, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //remove friend via endpoint
        const removeRes = await requester.delete(`/api/user/${userFriend._id}/friend`);
        //expect succes
        expect(removeRes).to.have.status(401);
        //save result
        const error = removeRes.body;


        //ASSERT

        //test if removal succeeded
        assert(error.error === 'not authorized');
    })

    it('acceptRequest valid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend request
        await session.run(neo.makeRequest, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //accept request via endpoint
        const acceptRes = await requester.post(`/api/user/${userFriend._id}/accept`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(acceptRes).to.have.status(200);
        //save result
        const accepted = acceptRes.body;


        //ASSERT

        //test if accepted succeeded
        assert(accepted.succes === true);
    })

    it('acceptRequest invalid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend request
        await session.run(neo.makeRequest, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //accept request via endpoint
        const acceptRes = await requester.post(`/api/user/${userFriend._id}/accept`);
        //expect error
        expect(acceptRes).to.have.status(401);
        //save error
        const error = acceptRes.body;


        //ASSERT

        //test if error shows correct message
        assert(error.error === 'not authorized');
    })

    it('ignoreRequest valid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend request
        await session.run(neo.makeRequest, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //accept request via endpoint
        const acceptRes = await requester.delete(`/api/user/${userFriend._id}/ignore`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(acceptRes).to.have.status(200);
        //save result
        const accepted = acceptRes.body;


        //ASSERT

        //test if accepted succeeded
        assert(accepted.succes === true);
    })

    it('ignoreRequest invalid', async () => {


        //make session
        const session = neo.session();
        //run query to make friend request
        await session.run(neo.makeRequest, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //accept request via endpoint
        const acceptRes = await requester.delete(`/api/user/${userFriend._id}/ignore`);
        //expect error
        expect(acceptRes).to.have.status(401);
        //save error
        const error = acceptRes.body;


        //ASSERT

        //test if error shows correct message
        assert(error.error === 'not authorized');
    })

    it('getRequests valid', async () => {

        //make session
        const session = neo.session();
        //run query to make friend request
        await session.run(neo.makeRequest, { user1Id: userFriend._id.toString(), user2Id: user._id.toString() });


        //ACT

        //accept request via endpoint
        const requestsRes = await requester.get(`/api/user/friends/requests`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(requestsRes).to.have.status(200);
        //save result
        const requests = requestsRes.body;


        //ASSERT

        //test if accepted succeeded
        assert(requests.length === 1);
        assert(requests[0].name === userFriend.name);
    })

    it('getRequests invalid', async () => {

        //make session
        const session = neo.session();
        //run query to make friend request
        await session.run(neo.makeRequest, { user1Id: user._id.toString(), user2Id: userFriend._id.toString() });


        //ACT

        //accept request via endpoint
        const requestsRes = await requester.get(`/api/user/friends/requests`).set('Authorization', 'Bearer ' + token);
        //expect succes
        expect(requestsRes).to.have.status(200);
        //save result
        const requests = requestsRes.body;


        //ASSERT

        //test if accepted succeeded
        assert(requests.length === 0);
    })
})