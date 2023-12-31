const Session = require('../models/Session');
const Patient = require('../models/Patient');
const Psychiatrist = require('../models/Psychiatrist');

const filterDeleted = { deleted: false };
const SessionController = {

  // Get all sessions
  async getAllSessions(req, res) {
    try {
        const sessions = await Session.find(filterDeleted);
        
        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });

    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
  },

  // Add a new session
  async addSession(req, res) {
    const { selectPatient, practitionerName, practitionerEmail,
      sessionType, sessionDate, sessionTimeSlot, onlineSessionLink, sessionDetails } = req.body;
      // console.log(req.body);

    // Splitting the selectPatient string to extract name and mobile number
    const [patientName, patientMobile] = selectPatient.split(' (');
    const mobileNumber = patientMobile.substring(0, patientMobile.length - 1); // Removing the closing bracket

    const patient = await Patient.find({ 
      name: patientName, 
      mobileNumber: mobileNumber, 
      ...filterDeleted 
    })
    // console.log(patient);
    if (!patient[0]) {
      return res.status(400).json({
        success: false,
        message: `Patient ${selectPatient} does not exist or has been deleted`
      });
    } 
    let patientId = patient[0]._id.toString() || ''

    // Splitting the practitionerName string to extract name and mobile number
    const [psychiatristName, psychiatristMobile] = practitionerName.split(' (');
    const mobileNumberPractitioner = psychiatristMobile.substring(0, psychiatristMobile.length - 1); // Removing the closing bracket

    const psychiatrist = await Psychiatrist.find({ 
      name: psychiatristName, 
      mobileNumber: mobileNumberPractitioner, 
      email: practitionerEmail,
      ...filterDeleted 
    })
    // console.log(psychiatrist);
    if (!psychiatrist[0]) {
      return res.status(400).json({
        success: false,
        message: `Psychiatrist ${practitionerName} does not exist or has been deleted`
      });
    } 
    let psychiatristId = psychiatrist[0]._id.toString() || ''

    // Additional checks for non-empty IDs before attempting to save
    if (patientId.trim() === '' || psychiatristId.trim() === '') {

        // Check empty ID fields
        const checkPatientAndPsychiatrist = (patientId.trim() === '' && psychiatristId.trim() === '');
        const checkPatient = (patientId.trim() === '');
        const checkPsychiatrist = (psychiatristId.trim() === '');
        
        // Build error fields message
        const errorFields = checkPatientAndPsychiatrist ? 'Patient-Id and Psychiatrist-Id' : 
                            checkPatient ? 'Patient-Id' : 
                            checkPsychiatrist ? 'Psychiatrist-Id' : ''
        
        return res.status(400).json({
          success: false,
          message: `${errorFields} is required`
        });
    }

    try {
      const newSession = new Session({
        patientId,
        sessionType,
        sessionDate,
        sessionTimeSlot,
        psychiatristId,
        onlineSessionLink,
        sessionDetails
      });

      await newSession.validate(); // Validate the session before saving

      const savedSession = await newSession.save();

    // const savedSession = await Session.create(req.body);
      
      res.status(201).json({
        success: true,
        data: savedSession
      });

    } catch (err) {
        // console.log(err);
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map((err) => err.message);
            return res.status(400).json({ 
                success: false, 
                message: errorMessages 
            });
        }
        // Handle other errors or exceptions here
        res.status(400).json({ 
            success: false,
            message: err.message 
        });
    }
  },

  // Edit an existing session by ID
  async editSession(req, res) {
    const { id } = req.params;
    const { patientId, sessionType, sessionDate, sessionTimeSlot, psychiatristId } = req.body;

    try {

        const session = await Session.findOne({ _id: id, ...filterDeleted });
        
        if (!session) {
          res.status(404).json({ 
            success: false,
            message: `Session does not exist or has been deleted`
          });
        } else {

            const updatedSession = await Session.findByIdAndUpdate(
              id,
              {
                patientId,
                sessionType,
                sessionDate,
                sessionTimeSlot,
                psychiatristId
              },
              { new: true }
            );

            res.status(200).json({
              success: true,
              data: updatedSession
            });
        }
        

    } catch (err) {

        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map((err) => err.message);
            return res.status(400).json({ 
                success: false, 
                message: errorMessages 
            });
        }
        // Handle other errors or exceptions here
        res.status(400).json({ 
            success: false,
            message: err.message 
        });
    }
  },

};

module.exports = SessionController;
