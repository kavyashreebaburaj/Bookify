const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "patron", //admin,patron,librarian
    },
    status: {
      type: String,
      required: true,
      default: "pending", //active,inactive,pending
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
