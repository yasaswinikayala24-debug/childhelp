const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    classLevel: {
      type: String,
      required: true,
      default: 'All Classes',
    },
    deadline: {
      type: String,
      required: true,
    },
    applicationUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
