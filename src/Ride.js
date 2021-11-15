const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideSchema = new Schema({
    name: String,
    beginDateTime: Date,
    endDateTime: Date,
    destination: {
        name: String,
        address: String,
        zipCode: String,
        city: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reservationDateTime: Date
});

const Ride = mongoose.model('ride', RideSchema);

module.exports = Ride;