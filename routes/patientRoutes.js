const express = require('express');
const router = express.Router();
const { getAllPatients, addPatient, searchPatients } = require('../controllers/patientController');


router.route('/')
    .get(getAllPatients) // Route to get all patients
    .post(addPatient) // Route to add a new patient


router.route('/search')
    .get(searchPatients) // Route to search patients using keywords

module.exports = router;
