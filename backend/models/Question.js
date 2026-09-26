const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      default: 'Student',
    },
    subject: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Answered', 'Closed'],
      default: 'Pending',
    },
    answer: {
      type: String,
      default: '',
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mentorName: {
      type: String,
      default: '',
    },
    answeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
