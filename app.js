require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const tokenValidator = require('./controllers/authenticationcontroller')

//enable cors for webapp
app.use(cors());

//use promises for mongoose
mongoose.Promise = global.Promise;

//connect to db for different environments
if (process.env.NODE_ENV !== 'test') {
    if (process.env.NODE_ENV === 'dev') {
        mongoose.connect(process.env.DEV_CONNECTION_STRING);
    } else {
        mongoose.connect(process.env.CONNECTION_STRING);
    }
}

//use json parser
app.use(bodyParser.json());

//log request url
app.use('*', (req, res, next) => {
    console.log(req.baseUrl);
    next();
});

//require routes
const carRoutes = require('./routes/car.routes');
const rideRoutes = require('./routes/ride.routes');
const userRoutes = require('./routes/user.routes');


//use authenticationroutes for login
app.use('/api', userRoutes)



//use carroutes for car
app.use('/api/car', tokenValidator.validate, carRoutes);

//use rideroutes for rides
app.use('/api/ride', tokenValidator.validate, rideRoutes);

//error handling
app.use((err, req, res, next) => {
    res.send({ error: err.message });
});

//no endpoint
app.use('*', (req, res, next) => {

    res.send({ error: 'could not find endpoint' });
});


module.exports = app;