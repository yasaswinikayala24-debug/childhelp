const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterialById,
  createMaterial,
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/materials - Get all materials
router.get('/', getMaterials);

// GET /api/materials/:id - Get material by ID
router.get('/:id', getMaterialById);

// POST /api/materials - Create material (Protected by JWT)
router.post('/', protect, createMaterial);

module.exports = router;
