const LearningProgress = require('../models/LearningProgress');
const Material = require('../models/Material');

// @desc    Get user's overall learning progress
// @route   GET /api/progress
// @access  Protected
const getOverallProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const progressRecords = await LearningProgress.find({ user: userId })
      .populate('material')
      .sort({ lastAccessed: -1 });

    res.json(progressRecords);
  } catch (error) {
    console.error('Error fetching overall progress:', error.message);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
};

// @desc    Get progress for a specific material
// @route   GET /api/progress/:materialId
// @access  Protected
const getProgressByMaterial = async (req, res) => {
  try {
    const userId = req.user._id;
    const { materialId } = req.params;

    let progress = await LearningProgress.findOne({ user: userId, material: materialId });
    if (!progress) {
      // Return zero initial progress
      progress = {
        user: userId,
        material: materialId,
        progressPercentage: 0,
        completed: false,
        timeSpent: 0,
      };
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching material progress:', error.message);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
};

// @desc    Update progress for a material
// @route   PUT /api/progress/:materialId
// @access  Protected
const updateProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { materialId } = req.params;
    const { progressPercentage, timeSpent } = req.body;

    const targetMaterial = await Material.findById(materialId);
    if (!targetMaterial) {
      return res.status(404).json({ message: 'Material not found' });
    }

    let progress = await LearningProgress.findOne({ user: userId, material: materialId });

    const newPercentage = Math.min(100, Math.max(0, Number(progressPercentage) || 0));
    const isCompleted = newPercentage === 100;

    if (!progress) {
      progress = new LearningProgress({
        user: userId,
        material: materialId,
        progressPercentage: newPercentage,
        completed: isCompleted,
        startedAt: new Date(),
        completedAt: isCompleted ? new Date() : null,
        lastAccessed: new Date(),
        timeSpent: Number(timeSpent) || 0,
      });
    } else {
      progress.progressPercentage = newPercentage;
      if (!progress.completed && isCompleted) {
        progress.completed = true;
        progress.completedAt = new Date();
      }
      progress.lastAccessed = new Date();
      if (timeSpent) {
        progress.timeSpent += Number(timeSpent);
      }
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error.message);
    res.status(500).json({ message: 'Server error updating progress' });
  }
};

module.exports = {
  getOverallProgress,
  getProgressByMaterial,
  updateProgress,
};
