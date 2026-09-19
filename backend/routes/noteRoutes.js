const express = require('express');
const router = express.Router();
const { createNote, getNotesByMaterial, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createNote);
router.get('/:materialId', getNotesByMaterial);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
