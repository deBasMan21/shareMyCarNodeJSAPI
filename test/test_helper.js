const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost/testdb');
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});

beforeEach((done) => {
    const { cars, rides, users } = mongoose.connection.collections;

    Promise.all([
        cars.drop(),
        rides.drop(),
        users.drop()
    ])
        .then(() => done());
});