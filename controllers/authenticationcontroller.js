const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');
const neo = require('../neo');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const jwt = require('node-jsonwebtoken');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

module.exports = {
    async login(req, res, next) {
        const email = req.body.email.toLowerCase();
        console.log(email)
        const password = req.body.password;
        User.findOne({ email: email }).then((user) => {
            bcrypt.compare(password, user.key, function (err, result) {
                if (result == true) {
                    const id = user._id.toString();

                    const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                        algorithm: 'RS256',
                        expiresIn: '1d',
                        subject: id
                    });

                    const today = new Date();
                    const date = new Date();
                    date.setDate(today.getDate() + 1);

                    res.send({ token: jwtBearerToken, expires: date });
                } else {
                    res.status(401).send({ error: 'login info invalid (email or password)' });
                }
            });
        }).catch(next);
    },
    register(req, res, next) {
        delete req.body._id;
        let userProps = req.body;
        userProps.email = userProps.email.toLowerCase();
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(userProps.key, salt, function (err, hash) {
                userProps.key = hash;
                const user = new User(userProps);
                user.save().then((user) => {
                    if (user) {
                        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: '1d',
                            subject: user._id.toString()
                        });

                        const today = new Date();
                        const date = new Date();
                        date.setDate(today.getDate() + 1);

                        res.send({ token: jwtBearerToken, expires: date });
                    }
                }).catch(next);
            });
        });
    },
    validate(req, res, next) {
        try {
            const token = req.headers.authorization.substring(7);
            jwt.verify(token, RSA_PRIVATE_KEY, {
                algorithms: ['RS256']
            }, (err, result) => {
                User.findById(result.sub).then((user) => {
                    next();
                }).catch(next);
            });
        } catch (err) {
            res.status(401).send({ error: "not authorized" });
        }
    },
    getUser(req, res, next) {
        try {
            const token = req.headers.authorization.substring(7);
            jwt.verify(token, RSA_PRIVATE_KEY, {
                algorithms: ['RS256']
            }, (err, result) => {
                User.findById(result.sub).then(async (user) => {
                    res.send(user);
                }).catch(next);
            });
        } catch (e) {
            res.status(401).send({ error: "not authorized" });
        }
    },
    getUserById(req, res, next) {
        const id = req.params.id;
        User.findById(id, { cars: 0 }).then((user) => {
            res.send(user);
        }).catch(next);
    },
    getAllUsers(req, res, next) {
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            User.find().then(async (users) => {
                const session = neo.session();
                const neoresult = await session.run(neo.getFriendsAndRequests, { id: result.sub });
                const items = neoresult.records[0].get('userIds');

                let returnUsers = [];
                returnUsers.push(...users);

                items.forEach((neouser) => {
                    users.forEach((user) => {
                        if (user._id.toString() == neouser || user._id == result.sub) {
                            returnUsers.splice(returnUsers.indexOf(user), 1);
                        }
                    });
                });
                res.send(returnUsers);
            }).catch(next);
        });

    }
}
