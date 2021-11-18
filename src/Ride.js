const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    beginDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    destination: {
        name: {
            type: String,
            required: true
        },
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