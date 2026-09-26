const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');

router.get('/stats', protect, requireAdmin, getAdminStats);
router.get('/users', protect, requireAdmin, getAllUsers);
router.put('/users/:id/role', protect, requireAdmin, updateUserRole);
router.delete('/users/:id', protect, requireAdmin, deleteUser);

module.exports = router;
