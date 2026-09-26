const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

// Admin user management routes
router.get('/users', protect, requireAdmin, getAllUsers);
router.delete('/users/:id', protect, requireAdmin, deleteUser);

module.exports = router;
