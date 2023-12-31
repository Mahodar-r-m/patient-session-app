const express = require('express');
const router = express.Router();
const { getAllSessions, addSession, editSession } = require('../controllers/SessionController');


router.route('/')
    .get(getAllSessions) // Route to get all sessions
    .post(addSession) // Route to add a new session

    
router.route('/:id')
    .put(editSession) // Route to edit an existing session by ID


module.exports = router;
