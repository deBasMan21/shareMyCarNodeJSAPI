require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
    // mongoose.connect('mongodb://localhost/sharemycar');
    console.log(process.env.CONNECTION_STRING);
    mongoose.connect(process.env.CONNECTION_STRING);
}

app.use(bodyParser.json());
routes(app);
app.use((err, req, res, next) => {
    res.send({ error: err.message });
});

module.exports = app;