const express = require('express');
const router = express.Router();
const {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/', getScholarships);
router.get('/:id', getScholarshipById);
router.post('/', protect, requireAdmin, createScholarship);
router.put('/:id', protect, requireAdmin, updateScholarship);
router.delete('/:id', protect, requireAdmin, deleteScholarship);

module.exports = router;
