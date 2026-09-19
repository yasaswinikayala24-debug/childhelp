const LearningGoal = require('../models/LearningGoal');

// Sample default goals if user has none
const sampleGoals = [
  {
    title: '🎯 Learn Python Basics',
    description: 'Master variables, data structures, and functions',
    targetMaterials: 10,
    completedMaterials: 6,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: 'IN_PROGRESS',
  },
  {
    title: '📐 Complete Geometry & Algebra',
    description: 'Finish all Grade 9 Mathematics modules',
    targetMaterials: 8,
    completedMaterials: 5,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
  },
];

// @desc    Get user's learning goals
// @route   GET /api/goals
// @access  Protected
const getGoals = async (req, res) => {
  try {
    const userId = req.user._id;

    let goals = await LearningGoal.find({ user: userId }).sort({ createdAt: -1 });

    if (goals.length === 0) {
      // Auto-create sample goals for initial user experience
      const initialGoals = sampleGoals.map((g) => ({ ...g, user: userId }));
      goals = await LearningGoal.insertMany(initialGoals);
    }

    res.json(goals);
  } catch (error) {
    console.error('Error fetching learning goals:', error.message);
    res.status(500).json({ message: 'Server error fetching goals' });
  }
};

// @desc    Create a new learning goal
// @route   POST /api/goals
// @access  Protected
const createGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, targetMaterials, deadline } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Goal title and deadline are required' });
    }

    const goal = new LearningGoal({
      user: userId,
      title,
      description: description || '',
      targetMaterials: Number(targetMaterials) || 5,
      completedMaterials: 0,
      deadline: new Date(deadline),
      status: 'IN_PROGRESS',
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error.message);
    res.status(500).json({ message: 'Server error creating goal' });
  }
};

// @desc    Update learning goal
// @route   PUT /api/goals/:id
// @access  Protected
const updateGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, completedMaterials, targetMaterials, status } = req.body;

    const goal = await LearningGoal.findOne({ _id: id, user: userId });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetMaterials !== undefined) goal.targetMaterials = Number(targetMaterials);
    if (completedMaterials !== undefined) {
      goal.completedMaterials = Number(completedMaterials);
      if (goal.completedMaterials >= goal.targetMaterials) {
        goal.status = 'COMPLETED';
      }
    }
    if (status) goal.status = status;

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error.message);
    res.status(500).json({ message: 'Server error updating goal' });
  }
};

// @desc    Delete learning goal
// @route   DELETE /api/goals/:id
// @access  Protected
const deleteGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const result = await LearningGoal.findOneAndDelete({ _id: id, user: userId });

    if (!result) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error.message);
    res.status(500).json({ message: 'Server error deleting goal' });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
