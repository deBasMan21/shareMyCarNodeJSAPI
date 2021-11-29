const neo = require('../neo');
const jwt = require('node-jsonwebtoken');
const fs = require('fs');
const User = require('../src/User');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

module.exports = {
    getFriends(req, res, next) {
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.getFriends, { id: result.sub });
            const items = neoresult.records[0].get('userIds');
            session.close();

            const friends = await User.find({ _id: { $in: items } });
            res.send(friends);
        })
    },
    makeFriend(req, res, next) {
        const token = req.headers.authorization.substring(7);
        const friendId = req.params.friendId;
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.makeRequest, { user1Id: result.sub, user2Id: friendId });
            const friendship = neoresult.records[0].get('friendship')
            session.close();

            if (friendship[0].type == "FRIEND_REQUESTED") {
                res.send({ succes: true });
            } else {
                res.send({ succes: false });
            }
        })
    },
    getFriendRecommendations(req, res, next) {
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.getFriendRecommendations, { id: result.sub });
            const items = neoresult.records[0].get('userIds')
            session.close();

            const friends = await User.find({ _id: { $in: items } });
            res.send(friends);
        })
    },
    removeFriend(req, res, next) {
        const token = req.headers.authorization.substring(7);
        const friendId = req.params.friendId;
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.removeFriend, { user1Id: result.sub, user2Id: friendId });
            session.close();
            res.send({ succes: true });
        })
    },
    acceptRequest(req, res, next) {
        const token = req.headers.authorization.substring(7);
        const friendId = req.params.friendId;
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.acceptRequest, { user1Id: result.sub, user2Id: friendId });
            session.close();
            res.send({ succes: true });
        })
    },
    ignoreRequest(req, res, next) {
        const token = req.headers.authorization.substring(7);
        const friendId = req.params.friendId;
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.ignoreRequest, { user1Id: result.sub, user2Id: friendId });
            session.close();
            res.send({ succes: true });
        })
    },
    getRequests(req, res, next) {
        const token = req.headers.authorization.substring(7);
        const friendId = req.params.friendId;
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, async (err, result) => {
            const session = neo.session();
            const neoresult = await session.run(neo.getRequests, { user1Id: result.sub });
            const items = neoresult.records[0].get('userIds')
            session.close();

            const friends = await User.find({ _id: { $in: items } });
            res.send(friends);
        })
    }
}
