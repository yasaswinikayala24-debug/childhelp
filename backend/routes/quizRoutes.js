const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/quizzes - Get all quizzes
router.get('/', getQuizzes);

// GET /api/quizzes/:id - Get quiz by ID
router.get('/:id', protect, getQuizById);

// POST /api/quizzes - Create quiz
router.post('/', protect, createQuiz);

// POST /api/quizzes/:id/submit - Submit quiz attempt
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
