const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: [true, "De locatie moet een naam hebben"],
  },
  address: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
});

module.exports = LocationSchema;
