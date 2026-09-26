const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// GET /api/materials - Get all materials
router.get('/', getMaterials);

// GET /api/materials/:id - Get material by ID
router.get('/:id', getMaterialById);

// POST /api/materials - Create material (Admin)
router.post('/', protect, requireAdmin, createMaterial);

// PUT /api/materials/:id - Update material (Admin)
router.put('/:id', protect, requireAdmin, updateMaterial);

// DELETE /api/materials/:id - Delete material (Admin)
router.delete('/:id', protect, requireAdmin, deleteMaterial);

module.exports = router;

