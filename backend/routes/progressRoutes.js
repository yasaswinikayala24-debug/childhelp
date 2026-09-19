const express = require('express');
const router = express.Router();
const { getOverallProgress, getProgressByMaterial, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getOverallProgress);
router.get('/:materialId', getProgressByMaterial);
router.put('/:materialId', updateProgress);

module.exports = router;
