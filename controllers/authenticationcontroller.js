const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');
const fs = require('fs');


const jwt = require('node-jsonwebtoken');

const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key');

function validateUser(email, password) {
    if (email && password) {
        console.log('goed')
        return true;
    } else {
        console.log('fout')
        return false;
    }
}

async function findUserForEmail(email) {
    const user = await User.findOne({ email: email });
    return user;
}

module.exports = {
    async login(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        if (validateUser(email, password) === true) {
            const user = await findUserForEmail(email);
            if (user) {
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
                res.status(401).send();
            }
        } else {
            res.status(401).send();
        }
    },
    register(req, res, next) {
        delete req.body._id;
        const userProps = req.body;
        const user = new User(userProps);
        user.save().then((user) => {
            console.log(user);
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
                });
            });
        } catch (err) {
            res.status(401).send({ message: "not authorized" });
        }
    },
    getUser(req, res, next) {
        const token = req.headers.authorization.substring(7);
        jwt.verify(token, RSA_PRIVATE_KEY, {
            algorithms: ['RS256']
        }, (err, result) => {
            User.findById(result.sub).then((user) => {
                res.send(user);
            });
        });
    },
    getUserById(req, res, next) {
        const id = req.params.id;
        User.findById(id, { cars: 0 }).then((user) => {
            res.send(user);
        }).catch(next);
    }
}
