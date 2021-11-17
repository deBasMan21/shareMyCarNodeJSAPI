const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    plate: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        required: true
    },
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: 'ride'
    }]
});

const Car = mongoose.model('car', CarSchema);

module.exports = Car;