const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Material description is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    classLevel: {
      type: String,
      required: [true, 'Class level is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['PDF', 'VIDEO', 'LINK'],
      default: 'PDF',
    },
    resourceUrl: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Material', materialSchema);
