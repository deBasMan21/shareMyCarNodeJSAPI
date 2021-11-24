const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: {
    type: String,
    required: [true, "De auto moet een naam hebben"],
  },
  plate: {
    type: String,
    required: [true, "De auto moet een kenteken hebben"],
    unique: [true, "Een kenteken mag maar 1 keer voorkomen"],
  },
  imageSrc: {
    type: String,
    required: [true, "De auto moet een plaatje hebben"],
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: "ride",
      default: [],
      autopopulate: true
    },
  ],
  isOwner: {
    type: Boolean,
    required: false
  }
});

CarSchema.plugin(require('mongoose-autopopulate'));

const Car = mongoose.model("car", CarSchema);

module.exports = Car;
