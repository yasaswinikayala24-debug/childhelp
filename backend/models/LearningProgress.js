const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: true,
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    timeSpent: {
      type: Number, // total seconds spent on this material
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

learningProgressSchema.index({ user: 1, material: 1 }, { unique: true });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
