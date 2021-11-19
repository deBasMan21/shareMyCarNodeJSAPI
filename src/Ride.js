const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LocationSchema = require("./Location");

const RideSchema = new Schema({
  name: {
    type: String,
    required: [true, "De rit moet een naam hebben"],
  },
  beginDateTime: {
    type: Date,
    required: [true, "De rit moet een begindatum en tijd hebben"],
  },
  endDateTime: {
    type: Date,
    required: [true, "De rit moet een einddatum en tijd hebben"],
  },
  destination: LocationSchema,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: [],
  },
  reservationDateTime: {
    type: Date,
    default: Date.now(),
  },
});

const Ride = mongoose.model("ride", RideSchema);

module.exports = Ride;
