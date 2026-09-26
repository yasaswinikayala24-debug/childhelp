const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/', getAnnouncements);
router.post('/', protect, requireAdmin, createAnnouncement);
router.put('/:id', protect, requireAdmin, updateAnnouncement);
router.delete('/:id', protect, requireAdmin, deleteAnnouncement);

module.exports = router;

