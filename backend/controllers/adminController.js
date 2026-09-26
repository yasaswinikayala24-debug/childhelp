const User = require('../models/User');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Scholarship = require('../models/Scholarship');
const Question = require('../models/Question');
const Announcement = require('../models/Announcement');

// @desc    Get system statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalMaterials = await Material.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalScholarships = await Scholarship.countDocuments();
    const totalQuizAttempts = await QuizAttempt.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();

    const totalQuestions = await Question.countDocuments();
    const pendingQuestions = await Question.countDocuments({ status: 'Pending' });
    const answeredQuestions = await Question.countDocuments({ status: 'Answered' });

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        mentors: totalMentors,
        admins: totalAdmins,
      },
      content: {
        materials: totalMaterials,
        quizzes: totalQuizzes,
        scholarships: totalScholarships,
        announcements: totalAnnouncements,
      },
      quizzes: {
        attempts: totalQuizAttempts,
      },
      questions: {
        total: totalQuestions,
        pending: pendingQuestions,
        answered: answeredQuestions,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to retrieve admin statistics' });
  }
};

// @desc    Get list of all registered users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch user list' });
  }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'mentor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
