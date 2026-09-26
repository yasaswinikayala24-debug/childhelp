const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// GET /api/quizzes - Get all quizzes
router.get('/', getQuizzes);

// GET /api/quizzes/:id - Get quiz by ID
router.get('/:id', protect, getQuizById);

// POST /api/quizzes - Create quiz (Admin)
router.post('/', protect, requireAdmin, createQuiz);

// PUT /api/quizzes/:id - Update quiz (Admin)
router.put('/:id', protect, requireAdmin, updateQuiz);

// DELETE /api/quizzes/:id - Delete quiz (Admin)
router.delete('/:id', protect, requireAdmin, deleteQuiz);

// POST /api/quizzes/:id/submit - Submit quiz attempt
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;

