const Announcement = require('../models/Announcement');

// @desc Get all announcements
// @route GET /api/announcements
// @access Public / Student
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements: ' + error.message });
  }
};

// @desc Create announcement
// @route POST /api/announcements
// @access Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, category } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      category: category || 'General',
      createdBy: req.user._id,
      authorName: req.user.name,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement: ' + error.message });
  }
};

// @desc Update announcement
// @route PUT /api/announcements/:id
// @access Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const { title, message, category } = req.body;
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (title) announcement.title = title;
    if (message) announcement.message = message;
    if (category) announcement.category = category;

    const updated = await announcement.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement: ' + error.message });
  }
};

// @desc Delete announcement
// @route DELETE /api/announcements/:id
// @access Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement: ' + error.message });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};

