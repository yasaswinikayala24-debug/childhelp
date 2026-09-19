const express = require('express');
const router = express.Router();
const {
  getMyAttempts,
  getAttemptById,
} = require('../controllers/quizAttemptController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/quiz-attempts/my - Get logged-in user's quiz attempts
router.get('/my', protect, getMyAttempts);

// GET /api/quiz-attempts/:id - Get specific attempt by ID
router.get('/:id', protect, getAttemptById);

module.exports = router;
