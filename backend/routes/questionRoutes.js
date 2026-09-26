const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getMyQuestions,
  getAllQuestions,
  answerQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { requireMentor } = require('../middleware/roleMiddleware');

router.post('/', protect, askQuestion);
router.get('/my', protect, getMyQuestions);
router.get('/', protect, requireMentor, getAllQuestions);
router.put('/:id/answer', protect, requireMentor, answerQuestion);

module.exports = router;
