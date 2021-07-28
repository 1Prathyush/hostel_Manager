const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    address: {
      type: String,
    },
    phone_number: {
      type: Number,
    },
    Institution: {
      type: String,
    },
    iaddress: {
      type: String,
    },
    firebaseuid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    hostels: [
      {
        hostelid: { type: String },
        name: { type: String },
        hcode: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manager", managerSchema);
