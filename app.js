require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

app.use(cors());

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'dev') {
        mongoose.connect(process.env.DEV_CONNECTION_STRING);
    } else {
        mongoose.connect(process.env.CONNECTION_STRING);
    }
}

app.use(bodyParser.json());
routes(app);
app.use((err, req, res, next) => {
    res.send({ error: err.message });
});

module.exports = app;