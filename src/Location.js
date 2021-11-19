const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: [true, "De locatie moet een naam hebben"],
  },
  address: String,
  zipCode: String,
  city: String,
});

module.exports = LocationSchema;
