const Material = require('../models/Material');

// Sample materials to seed automatically if collection is empty
const sampleMaterials = [
  {
    title: 'Python Loops & Control Structures',
    description: 'Master for loops, while loops, nested loops, break, and continue statements in Python with practical exercises.',
    subject: 'Programming',
    classLevel: '10',
    type: 'VIDEO',
    difficulty: 'Beginner',
    estimatedTime: 20,
    keywords: ['python', 'loops', 'for loop', 'while loop', 'programming'],
    resourceUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
  },
  {
    title: 'Python Functions & Scope',
    description: 'Learn how to define functions, pass positional & keyword arguments, return values, and understand local vs global variables.',
    subject: 'Programming',
    classLevel: '10',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    type: 'ARTICLE',
    keywords: ['python', 'functions', 'scope', 'def', 'arguments'],
    resourceUrl: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
  },
  {
    title: 'Algebra Fundamentals & Quadratic Equations',
    description: 'Comprehensive guide to solving quadratic equations, factoring polynomials, and algebraic graph analysis.',
    subject: 'Mathematics',
    classLevel: '9',
    type: 'PDF',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    keywords: ['mathematics', 'algebra', 'quadratic', 'equations', 'math'],
    resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    title: 'Introduction to Physics & Motion',
    description: 'Explore velocity, acceleration, Newton laws of motion, and physical forces through real-world examples.',
    subject: 'Science',
    classLevel: '8',
    type: 'LINK',
    difficulty: 'Beginner',
    estimatedTime: 15,
    keywords: ['science', 'physics', 'motion', 'newton', 'force'],
    resourceUrl: 'https://en.wikipedia.org/wiki/Motion_(physics)',
  },
  {
    title: 'Complete English Grammar & Vocabulary',
    description: 'Master tenses, active/passive voice, direct/indirect speech, sentence formation, and essential vocabulary.',
    subject: 'English',
    classLevel: '7',
    type: 'PDF',
    difficulty: 'Beginner',
    estimatedTime: 18,
    keywords: ['english', 'grammar', 'tenses', 'vocabulary', 'essays'],
    resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    title: 'Human Biology & Cell Structure',
    description: 'Detailed study of plant and animal cell organelles, cell division, and human organ system basics.',
    subject: 'Science',
    classLevel: '8',
    type: 'ARTICLE',
    difficulty: 'Intermediate',
    estimatedTime: 22,
    keywords: ['science', 'biology', 'cells', 'human body', 'organelles'],
    resourceUrl: 'https://en.wikipedia.org/wiki/Cell_(biology)',
  },
  {
    title: 'General Knowledge & World Wonders',
    description: 'World geography, historical achievements, UNESCO heritage sites, and fun trivia for young minds.',
    subject: 'General Knowledge',
    classLevel: '6',
    type: 'LINK',
    difficulty: 'Beginner',
    estimatedTime: 10,
    keywords: ['general knowledge', 'gk', 'geography', 'wonders', 'trivia'],
    resourceUrl: 'https://www.wikipedia.org',
  },
  {
    title: 'Introduction to SQL & Relational Databases',
    description: 'Learn database tables, SQL queries (SELECT, WHERE, JOIN), primary keys, and data relationships.',
    subject: 'Programming',
    classLevel: '10',
    type: 'VIDEO',
    difficulty: 'Advanced',
    estimatedTime: 40,
    keywords: ['sql', 'database', 'queries', 'programming', 'relational'],
    resourceUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
  },
];

// @desc    Get all study materials with search, filter, and sorting
// @route   GET /api/materials
// @access  Public / Protected
const getMaterials = async (req, res) => {
  try {
    const { search, subject, classLevel, difficulty, type, sort } = req.query;

    // Auto-seed if collection is empty
    const count = await Material.countDocuments();
    if (count === 0) {
      console.log('Seeding initial sample study materials...');
      await Material.insertMany(sampleMaterials);
    }

    let query = {};

    // Advanced search across title, description, subject, and keywords
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { subject: regex },
        { keywords: regex },
      ];
    }

    // Filter by Subject
    if (subject && subject !== 'All Subjects') {
      query.subject = new RegExp(`^${subject.trim()}$`, 'i');
    }

    // Filter by Class Level
    if (classLevel && classLevel !== 'All Classes') {
      const classNum = classLevel.replace('Class ', '').trim();
      query.classLevel = classNum;
    }

    // Filter by Difficulty
    if (difficulty && difficulty !== 'All Levels') {
      query.difficulty = difficulty;
    }

    // Filter by Type
    if (type && type !== 'All Types') {
      query.type = type;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: Newest
    if (sort === 'Oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'Shortest Learning Time') {
      sortOptions = { estimatedTime: 1 };
    } else if (sort === 'Longest Learning Time') {
      sortOptions = { estimatedTime: -1 };
    } else if (sort === 'Beginner Friendly') {
      sortOptions = { difficulty: 1, estimatedTime: 1 };
    }

    const materials = await Material.find(query).sort(sortOptions).populate('uploadedBy', 'name email');

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
    const { title, description, subject, classLevel, type, resourceUrl, difficulty, estimatedTime, keywords } = req.body;

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
      difficulty: difficulty || 'Beginner',
      estimatedTime: Number(estimatedTime) || 15,
      keywords: Array.isArray(keywords) ? keywords : keywords ? keywords.split(',').map((k) => k.trim()) : [],
      uploadedBy: req.user ? req.user._id : null,
    });

    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    console.error('Error creating study material:', error.message);
    res.status(500).json({ message: 'Server error creating study material' });
  }
};

// @desc    Update study material
// @route   PUT /api/materials/:id
// @access  Protected (Admin/UploadedBy)
const updateMaterial = async (req, res) => {
  try {
    const { title, description, subject, classLevel, type, resourceUrl, difficulty, estimatedTime, keywords } = req.body;
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (title) material.title = title;
    if (description) material.description = description;
    if (subject) material.subject = subject;
    if (classLevel) material.classLevel = classLevel;
    if (type) material.type = type;
    if (resourceUrl) material.resourceUrl = resourceUrl;
    if (difficulty) material.difficulty = difficulty;
    if (estimatedTime) material.estimatedTime = Number(estimatedTime);
    if (keywords) {
      material.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map((k) => k.trim());
    }

    const updated = await material.save();
    res.json(updated);
  } catch (error) {
    console.error('Error updating material:', error.message);
    res.status(500).json({ message: 'Server error updating study material' });
  }
};

// @desc    Delete study material
// @route   DELETE /api/materials/:id
// @access  Protected (Admin)
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error.message);
    res.status(500).json({ message: 'Server error deleting study material' });
  }
};

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

