const express = require('express');
const router = express.Router();
const { startSession, endSession, getSummary } = require('../controllers/studySessionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startSession);
router.post('/end', endSession);
router.get('/summary', getSummary);

module.exports = router;
