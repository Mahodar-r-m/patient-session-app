const Patient = require('../models/Patient');

const filterDeleted = { deleted: false };
const PatientController = {

  // Get all patients
  async getAllPatients(req, res) {
    try {
      const patients = await Patient.find(filterDeleted).select("-deleted");
      
      res.status(200).json({
        success: true,
        count: patients.length,
        data: patients
      });

    } catch (err) {
      
      res.status(500).json({ 
        success: false,
        message: err.message 
      });
    }
  },

  // Add a new patient
  async addPatient(req, res) {
    const { name, mobileNumber, whatsappNumber, email, address } = req.body;

    try {
      const newPatient = new Patient({
        name,
        mobileNumber,
        whatsappNumber,
        email,
        address
      });

      await newPatient.validate(); // Validate the patient before saving

      const savedPatient = await newPatient.save();

      res.status(201).json({
        success: true,
        data: savedPatient
      });

    } catch (err) {

      // if (err.code === 11000 && err.keyPattern && err.keyPattern.mobileNumber) {
      //   // Handling duplicate mobile number error
      //   return res.status(400).json({ success: false, message: 'Mobile number already exists' });
      // }
      if (err.code === 11000) {
        const fieldName = Object.keys(err.keyPattern)[0];
        const errorMessage = `Patient with this ${fieldName} already exists`;
        return res.status(400).json({ 
          success: false, 
          message: errorMessage 
        });
      }
      
      if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map((err) => err.message);
        return res.status(400).json({ 
            success: false, 
            message: errorMessages 
        });
      }
      // Handle other errors or exceptions
      res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }
  },

  // Search patients by name
  async searchPatients(req, res) {
    const { keyword } = req.query;

    try {
      // const patients = await Patient.find({
      //   $and: [
      //     filterDeleted,
      //     // name: { $regex: new RegExp(keyword, 'i') } // Case-insensitive search
      //     { name: { $regex: new RegExp(`^${keyword}`, 'i') } } // Case-insensitive search from the start
      //   ]
      // })

      // Updated code with spread operator
      const patients = await Patient.find({
        ...filterDeleted,
        // name: { $regex: new RegExp(keyword, 'i') } // Case-insensitive search
        name: { $regex: new RegExp(`^${keyword}`, 'i') } // Case-insensitive search from the start
      })      
      .select('-email -address -deleted -createdAt');

      res.json({
        success: true,
        count: patients.length,
        data: patients
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        message: err.message 
      });
    }
  }
};

module.exports = PatientController;
