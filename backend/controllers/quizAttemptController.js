const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get logged in student's quiz attempts
// @route   GET /api/quiz-attempts/my
// @access  Protected
exports.getMyAttempts = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const attempts = await QuizAttempt.find({ student: userId })
      .populate('quiz', 'title subject classLevel')
      .sort({ createdAt: -1 });

    res.status(200).json(attempts);
  } catch (error) {
    console.error('Error fetching student attempts:', error);
    res.status(500).json({ message: 'Server error while fetching attempts' });
  }
};

// @desc    Get single quiz attempt by ID
// @route   GET /api/quiz-attempts/:id
// @access  Protected
exports.getAttemptById = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const attempt = await QuizAttempt.findById(req.params.id).populate('quiz', 'title subject classLevel questions');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    // Ensure student only accesses their own attempt
    if (attempt.student.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this attempt record' });
    }

    res.status(200).json(attempt);
  } catch (error) {
    console.error('Error fetching attempt by ID:', error);
    res.status(500).json({ message: 'Server error while fetching attempt' });
  }
};
