const mongoose = require('mongoose');

const psychiatristSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: [true, 'Psychiatrist with this mobile number already exists'] // Assuming mobile number is unique for each psychiatrist
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Psychiatrist with this email already exists'], // Assuming email is unique for each psychiatrist
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deleted: {
    type: Boolean,
    default: false
  }
});

const Psychiatrist = mongoose.model('Psychiatrist', psychiatristSchema);

module.exports = Psychiatrist;
