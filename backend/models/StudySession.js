const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudySession', studySessionSchema);
