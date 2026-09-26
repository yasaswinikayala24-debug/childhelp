const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/', getAnnouncements);
router.post('/', protect, requireAdmin, createAnnouncement);
router.delete('/:id', protect, requireAdmin, deleteAnnouncement);

module.exports = router;
