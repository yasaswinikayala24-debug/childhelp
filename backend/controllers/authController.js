const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'childhelp_super_secret_jwt_key_2026',
    { expiresIn: '1d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, fullName, email, password, role } = req.body;
    const userName = (name || fullName || '').trim();

    // 1. Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields: name/fullName, email, and password' });
    }

    // Email format validation check
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Restrict registration roles to 'student' or 'mentor'
    const allowedRoles = ['student', 'mentor'];
    const userRole = role && allowedRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'student';

    // 2. Check whether email already exists (HTTP 409 Conflict)
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists. Please log in.' });
    }

    // 3. Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save user to MongoDB
    const user = await User.create({
      name: userName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole,
    });

    if (user) {
      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
};

// @desc    Authenticate user & get token (Supports existing & instant new logins)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Find user by email
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare password for existing user
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Generate JWT with user id and role
    const token = generateToken(user._id, user.role);

    // 4. Return token and user details (excluding password)
    return res.status(200).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.error('Profile Retrieval Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
