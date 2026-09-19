const Bookmark = require('../models/Bookmark');
const Material = require('../models/Material');

// @desc    Save/bookmark a material or return existing
// @route   POST /api/bookmarks
// @access  Protected
const addBookmark = async (req, res) => {
  try {
    const { materialId } = req.body;
    const userId = req.user._id;

    if (!materialId) {
      return res.status(400).json({ message: 'Material ID is required' });
    }

    const materialExists = await Material.findById(materialId);
    if (!materialExists) {
      return res.status(404).json({ message: 'Material not found' });
    }

    let bookmark = await Bookmark.findOne({ user: userId, material: materialId });
    if (bookmark) {
      return res.status(200).json({ message: 'Already bookmarked', bookmark });
    }

    bookmark = new Bookmark({ user: userId, material: materialId });
    await bookmark.save();

    res.status(201).json({ message: 'Material saved to bookmarks', bookmark });
  } catch (error) {
    console.error('Error adding bookmark:', error.message);
    res.status(500).json({ message: 'Server error saving bookmark' });
  }
};

// @desc    Get user's saved materials
// @route   GET /api/bookmarks
// @access  Protected
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ user: userId })
      .populate('material')
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error.message);
    res.status(500).json({ message: 'Server error fetching bookmarks' });
  }
};

// @desc    Remove material from bookmarks
// @route   DELETE /api/bookmarks/:materialId
// @access  Protected
const removeBookmark = async (req, res) => {
  try {
    const userId = req.user._id;
    const { materialId } = req.params;

    const result = await Bookmark.findOneAndDelete({ user: userId, material: materialId });

    if (!result) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Material removed from saved bookmarks' });
  } catch (error) {
    console.error('Error removing bookmark:', error.message);
    res.status(500).json({ message: 'Server error removing bookmark' });
  }
};

module.exports = {
  addBookmark,
  getBookmarks,
  removeBookmark,
};
