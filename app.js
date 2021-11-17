const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sharemycar');

app.use(bodyParser.json());
routes(app);
app.use((err, req, res, next) => {
    res.send({ error: err.message });
});

module.exports = app;