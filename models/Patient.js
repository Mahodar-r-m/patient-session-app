const mongoose = require('mongoose');

// Creating a Mongoose schema for the Patient table
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: [true, 'Patient with this mobile number already exists'] // Assuming mobile number is unique for each patient
    // unique: true
  },
  whatsappNumber: {
    type: String,
    required: [true, 'Whatsapp number is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Patient with this email already exists'], // Assuming email is unique for each psychiatrist
    // unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    // required: [true, 'Address is required']
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

// Creating a model using the schema
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
