const mongoose = require('mongoose');

const learningGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    targetMaterials: {
      type: Number,
      required: true,
      default: 5,
    },
    completedMaterials: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'EXPIRED'],
      default: 'IN_PROGRESS',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LearningGoal', learningGoalSchema);
