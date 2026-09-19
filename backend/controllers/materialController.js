const Material = require('../models/Material');

// @desc    Get all study materials (with optional search and filter)
// @route   GET /api/materials
// @access  Public / Private
const getMaterials = async (req, res) => {
  try {
    const { search, subject, classLevel } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (subject && subject !== 'All Subjects') {
      query.subject = { $regex: new RegExp(`^${subject}$`, 'i') };
    }

    if (classLevel && classLevel !== 'All Classes') {
      query.classLevel = { $regex: new RegExp(`^${classLevel}$`, 'i') };
    }

    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error.message);
    return res.status(500).json({ message: 'Server error fetching study materials: ' + error.message });
  }
};

// @desc    Get single study material by ID
// @route   GET /api/materials/:id
// @access  Public / Private
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid study material ID format' });
    }

    const material = await Material.findById(id).populate('uploadedBy', 'name email role');

    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    return res.status(200).json(material);
  } catch (error) {
    console.error('Error fetching material by ID:', error.message);
    return res.status(500).json({ message: 'Server error fetching material details' });
  }
};

// @desc    Create a new study material
// @route   POST /api/materials
// @access  Private (Protected by JWT)
const createMaterial = async (req, res) => {
  try {
    const { title, description, subject, classLevel, type, resourceUrl } = req.body;

    // Field validations
    if (!title || !description || !subject || !classLevel || !type || !resourceUrl) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, subject, classLevel, type, resourceUrl',
      });
    }

    const validTypes = ['PDF', 'VIDEO', 'LINK'];
    if (!validTypes.includes(type.toUpperCase())) {
      return res.status(400).json({
        message: 'Invalid material type. Allowed types: PDF, VIDEO, LINK',
      });
    }

    const newMaterial = await Material.create({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      classLevel: classLevel.trim(),
      type: type.toUpperCase(),
      resourceUrl: resourceUrl.trim(),
      uploadedBy: req.user ? req.user._id : null,
    });

    return res.status(201).json({
      message: 'Study material created successfully',
      material: newMaterial,
    });
  } catch (error) {
    console.error('Error creating study material:', error.message);
    return res.status(500).json({ message: 'Server error creating study material: ' + error.message });
  }
};

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
};
