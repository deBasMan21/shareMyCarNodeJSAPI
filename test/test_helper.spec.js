const mongoose = require('mongoose');
const neo_driver = require('../neo');

mongoose.Promise = global.Promise;

before((done) => {
    neo_driver.connect('ShareMyCarTest');
    mongoose.connect(process.env.TEST_CONNECTION_STRING).then(() => {
        done();
    });
})

beforeEach(async () => {
    const { cars, rides, users } = mongoose.connection.collections;

    try {
        await cars.drop();
    } catch (e) {
        if (e.codeName !== 'NamespaceNotFound') {
            throw e;
        }
    }
    try {
        await users.drop();
    } catch (e) {
        if (e.codeName !== 'NamespaceNotFound') {
            throw e;
        }
    }
    try {
        await rides.drop();
        return;
    } catch (e) {
        if (e.codeName !== 'NamespaceNotFound') {
            throw e;
        }
    }
});