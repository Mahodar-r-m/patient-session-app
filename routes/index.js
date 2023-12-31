var express = require('express');
var router = express.Router();
const Session = require('../models/Session');

// GET home page
router.get('/', async function(req, res, next) {

  const filterDeleted = { deleted: false };
  const sessions = await Session.find(filterDeleted).populate({
    path: 'patientId',
    select: 'name' // Populate multiple fields from the Patient collection
  })
  .sort({ sessionDate: 1, sessionTimeSlot: 1 });
  console.log(sessions);
  res.render('index', { title: 'Patient App', data: sessions });
});

// GET add session page
router.get('/addsession', function(req, res, next) {
  res.render('addsession', { title: 'Add Session | Patient App' });
});

module.exports = router;
