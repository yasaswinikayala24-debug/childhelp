const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookmarks per user for the same material
bookmarkSchema.index({ user: 1, material: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
