const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterialById,
  createMaterial,
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/materials
router.get('/', getMaterials);

// GET /api/materials/:id
router.get('/:id', getMaterialById);

// POST /api/materials (Protected)
router.post('/', protect, createMaterial);

module.exports = router;
