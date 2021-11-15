const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost/sharemycar');
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});

beforeEach((done) => {
    const { cars, rides, users } = mongoose.connection.collection;

    // cars.drop(() => {
    //     rides.drop(() => {
    //         users.drop(() => {
    //             done();
    //         });
    //     });
    // });
    done();
});