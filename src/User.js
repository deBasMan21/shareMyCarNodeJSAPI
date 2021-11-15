const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    phoneNumber: String,
    cars: [{
        type: Schema.Types.ObjectId,
        ref: 'car'
    }]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;