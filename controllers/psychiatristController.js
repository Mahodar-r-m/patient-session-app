const Psychiatrist = require('../models/Psychiatrist');

const filterDeleted = { deleted: false };
const PsychiatristController = {

    
    // Get all psychiatrists
    async getAllPsychiatrists(req, res) {
        try {

            const psychiatrists = await Psychiatrist.find(filterDeleted).select("-deleted");
            res.status(200).json({
                success: true,
                count: psychiatrists.length,
                data: psychiatrists
            });

        } catch (err) {

            res.status(500).json({ 
                success: false, 
                message: err.message 
                // message: 'An error occurred while fetching psychiatrists' 
            });
        
        }
    },

    // Add a new psychiatrist
    async addPsychiatrist(req, res) {
        try {

            const { name, mobileNumber, email } = req.body;
            const newPsychiatrist = new Psychiatrist({ 
                name, 
                mobileNumber,
                email 
            });

            await newPsychiatrist.validate(); // Validate the psychiatrist before saving

            const savedPsychiatrist = await newPsychiatrist.save();

            res.status(201).json({
                success: true,
                data: savedPsychiatrist
            });

        } catch (err) {

            if (err.name === 'ValidationError') {
                const errorMessages = Object.values(err.errors).map((err) => err.message);
                return res.status(400).json({ 
                    success: false, 
                    message: errorMessages 
                });
              }
              // Handle other errors or exceptions
            res.status(500).json({ 
                success: false, 
                message: err.message 
                // message: 'An error occurred while adding a psychiatrist' 
            });
        
        }
    }
};

module.exports = PsychiatristController;
