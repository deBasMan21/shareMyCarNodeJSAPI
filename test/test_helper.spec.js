const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost/sharemycar');
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Warning', error);
            done();
        });
});

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