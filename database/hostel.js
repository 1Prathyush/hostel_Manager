const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hcode: {
    type: String,
    required:true
  },
  Place: {
    type: String,
    required: true,
  },
  Createdby: {
    type: String,
    required: true,
  },
  Announcements: [
    {
      Message: {
        type: String,
      },
      date: {
        type: Date,
      },
      auther: {
        type: String,
      },
    },
  ],
  Hostelphone: {
    type: Number,
    // required: true,
  },
  members: [
    {
      memberuid: {
        type: String,
      },
      name: { type: String },
      // RoomNo: { type: Number },
    },
  ],
});

module.exports = mongoose.model("hostel", hostelSchema);
