const express = require('express');
const router = express.Router();
const { addPsychiatrist, getAllPsychiatrists } = require('../controllers/psychiatristController');


router.route('/')
    .get(getAllPsychiatrists) // Route to fetch all psychiatrist records
    .post(addPsychiatrist) // Route to add a new psychiatrist record

module.exports = router;
