const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 1,
      max: 30,
    },

    email: {
      type: String,
      required: true,
      min: 8,
      max: 320,
    },

    password: {
      type: String,
      required: true,
      min: 8,
      max: 1024,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
