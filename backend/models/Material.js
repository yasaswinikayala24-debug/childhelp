const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    classLevel: {
      type: String,
      required: [true, 'Please provide a class level'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['PDF', 'VIDEO', 'LINK'],
      required: [true, 'Please specify material type (PDF, VIDEO, or LINK)'],
    },
    resourceUrl: {
      type: String,
      required: [true, 'Please provide a resource URL'],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('Material', materialSchema);
