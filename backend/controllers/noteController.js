const Note = require('../models/Note');

// @desc    Create a new note for a material
// @route   POST /api/notes
// @access  Protected
const createNote = async (req, res) => {
  try {
    const { materialId, content } = req.body;
    const userId = req.user._id;

    if (!materialId || !content) {
      return res.status(400).json({ message: 'Material ID and content are required' });
    }

    const note = new Note({
      user: userId,
      material: materialId,
      content,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ message: 'Server error saving note' });
  }
};

// @desc    Get notes for a specific material or all user notes
// @route   GET /api/notes/:materialId
// @access  Protected
const getNotesByMaterial = async (req, res) => {
  try {
    const userId = req.user._id;
    const { materialId } = req.params;

    const notes = await Note.find({ user: userId, material: materialId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    res.status(500).json({ message: 'Server error fetching notes' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Protected
const updateNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { content } = req.body;

    const note = await Note.findOne({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.content = content || note.content;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error.message);
    res.status(500).json({ message: 'Server error updating note' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Protected
const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const result = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!result) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error.message);
    res.status(500).json({ message: 'Server error deleting note' });
  }
};

module.exports = {
  createNote,
  getNotesByMaterial,
  updateNote,
  deleteNote,
};
