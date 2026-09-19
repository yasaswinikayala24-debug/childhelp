const Material = require('../models/Material');

// Sample materials to seed automatically if collection is empty
const sampleMaterials = [
  {
    title: 'Introduction to Python',
    description: 'Basic Python programming concepts covering variables, loops, data structures, and functions.',
    subject: 'Programming',
    classLevel: '10',
    type: 'VIDEO',
    resourceUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
  },
  {
    title: 'Basic Mathematics',
    description: 'Comprehensive guide to high school geometry, algebra formulas, and practice problems.',
    subject: 'Mathematics',
    classLevel: '9',
    type: 'PDF',
    resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    title: 'Introduction to Science',
    description: 'Fundamental physics, chemistry concepts, and interactive biology experiments.',
    subject: 'Science',
    classLevel: '8',
    type: 'LINK',
    resourceUrl: 'https://en.wikipedia.org/wiki/Science',
  },
  {
    title: 'English Grammar & Vocabulary',
    description: 'Master tenses, sentence formation, essay writing, and essential English vocabulary.',
    subject: 'English',
    classLevel: '7',
    type: 'PDF',
    resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    title: 'General Knowledge & Current Affairs',
    description: 'World geography, historical events, world records, and fun trivia for young learners.',
    subject: 'General Knowledge',
    classLevel: '6',
    type: 'LINK',
    resourceUrl: 'https://www.wikipedia.org',
  },
];

// @desc    Get all study materials (auto-seeds sample data if empty)
// @route   GET /api/materials
// @access  Public / Protected
const getMaterials = async (req, res) => {
  try {
    let materials = await Material.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');

    // Auto-seed sample materials if database collection is empty
    if (materials.length === 0) {
      console.log('Seeding initial sample study materials...');
      await Material.insertMany(sampleMaterials);
      materials = await Material.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');
    }

    res.json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error.message);
    res.status(500).json({ message: 'Server error fetching study materials' });
  }
};

// @desc    Get single material by ID
// @route   GET /api/materials/:id
// @access  Public / Protected
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const material = await Material.findById(id).populate('uploadedBy', 'name email');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    console.error('Error fetching material by ID:', error.message);
    res.status(500).json({ message: 'Server error fetching material details' });
  }
};

// @desc    Create new study material
// @route   POST /api/materials
// @access  Protected
const createMaterial = async (req, res) => {
  try {
    const { title, description, subject, classLevel, type, resourceUrl } = req.body;

    if (!title || !description || !subject || !classLevel || !resourceUrl) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const material = new Material({
      title,
      description,
      subject,
      classLevel,
      type: type || 'PDF',
      resourceUrl,
      uploadedBy: req.user ? req.user._id : null,
    });

    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    console.error('Error creating study material:', error.message);
    res.status(500).json({ message: 'Server error creating study material' });
  }
};

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
};
