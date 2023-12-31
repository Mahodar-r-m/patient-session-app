const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  sessionType: {
    type: String,
    enum: ['In-Person', 'Online'],
    required: [true, 'Session type is required']
  },
  sessionDate: {
    type: Date,
    required: [true, 'Session date is required']
  },
  sessionTimeSlot: {
    type: String,
    required: [true, 'Session time slot is required']
  },
  // psychiatristId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Psychiatrist',
  //   validate: {
  //     validator: function (v) {
  //       return v != null; // Validate that psychiatristId is not null or undefined
  //     },
  //     message: 'Psychiatrist ID is required' // Custom error message for psychiatristId validation
  //   }
  // },
  psychiatristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Psychiatrist',
    required: [true, 'Psychiatrist ID is required']
  },
  sessionDetails: {
    type: String,
    default: '',
    // Optional
  },
  onlineSessionLink: {
    type: String,
    required: [ (value) => {
      // return !(this.sessionType === 'Online' && value.onlineSessionLink) // Make OnlineSessionLink required only for Online sessions
      return this.sessionType === 'Online' // Make OnlineSessionLink required only for Online sessions
    }, 'Online Session Link is required']
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

// sessionSchema.pre('save', function (next) {
//   if (!this.psychiatristId) {
//     this.invalidate('psychiatristId', 'Psychiatrist ID is required'); // Custom error for psychiatristId
//   }
//   next();
// });


const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
