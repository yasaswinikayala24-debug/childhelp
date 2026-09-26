const Scholarship = require('../models/Scholarship');

// @desc Get all scholarships
// @route GET /api/scholarships
// @access Public / Student
const getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scholarships: ' + error.message });
  }
};

// @desc Get scholarship by ID
// @route GET /api/scholarships/:id
// @access Public / Student
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scholarship: ' + error.message });
  }
};

// @desc Create scholarship
// @route POST /api/scholarships
// @access Private/Admin
const createScholarship = async (req, res) => {
  try {
    const { title, description, provider, eligibility, classLevel, deadline, applicationUrl, category } = req.body;
    if (!title || !description || !provider || !eligibility || !deadline || !applicationUrl) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const scholarship = await Scholarship.create({
      title,
      description,
      provider,
      eligibility,
      classLevel: classLevel || 'All Classes',
      deadline,
      applicationUrl,
      category: category || 'General',
      createdBy: req.user._id,
    });

    res.status(201).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: 'Error creating scholarship: ' + error.message });
  }
};

// @desc Update scholarship
// @route PUT /api/scholarships/:id
// @access Private/Admin
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    Object.assign(scholarship, req.body);
    const updated = await scholarship.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating scholarship: ' + error.message });
  }
};

// @desc Delete scholarship
// @route DELETE /api/scholarships/:id
// @access Private/Admin
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    await scholarship.deleteOne();
    res.json({ message: 'Scholarship removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scholarship: ' + error.message });
  }
};

module.exports = {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
};
