const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "User moet een naam hebben"],
  },
  email: {
    type: String,
    required: [true, "User moet een email hebben"],
    unique: [true, "User moet een uniek email hebben"],
  },
  phoneNumber: String,
  cars: [
    {
      type: Schema.Types.ObjectId,
      ref: "car",
    },
  ],
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
