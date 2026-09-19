const Material = require('../models/Material');
const LearningProgress = require('../models/LearningProgress');
const Bookmark = require('../models/Bookmark');

// @desc    Get personalized material recommendations
// @route   GET /api/recommendations
// @access  Protected
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's completed or started materials
    const userProgress = await LearningProgress.find({ user: userId }).populate('material');
    const userBookmarks = await Bookmark.find({ user: userId }).populate('material');

    // Extract subjects student frequently interacts with
    const subjectCounts = {};
    userProgress.forEach((p) => {
      if (p.material && p.material.subject) {
        subjectCounts[p.material.subject] = (subjectCounts[p.material.subject] || 0) + 2;
      }
    });
    userBookmarks.forEach((b) => {
      if (b.material && b.material.subject) {
        subjectCounts[b.material.subject] = (subjectCounts[b.material.subject] || 0) + 1;
      }
    });

    // Find top subject (default to Programming / Mathematics if none)
    let topSubject = 'Programming';
    let maxCount = 0;
    Object.keys(subjectCounts).forEach((sub) => {
      if (subjectCounts[sub] > maxCount) {
        maxCount = subjectCounts[sub];
        topSubject = sub;
      }
    });

    // Fetch materials matching top subject, excluding already completed ones
    const completedIds = userProgress.filter((p) => p.completed).map((p) => p.material._id.toString());

    let recommendations = await Material.find({
      subject: topSubject,
      _id: { $nin: completedIds },
    })
      .limit(4)
      .sort({ createdAt: -1 });

    // Fallback if not enough matching materials found
    if (recommendations.length < 3) {
      const fallback = await Material.find({ _id: { $nin: completedIds } })
        .limit(4 - recommendations.length)
        .sort({ createdAt: -1 });
      recommendations = [...recommendations, ...fallback];
    }

    res.json({
      reason: `Because you are learning ${topSubject}`,
      topSubject,
      recommendations,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error.message);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
};

module.exports = {
  getRecommendations,
};
