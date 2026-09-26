const Question = require('../models/Question');

// @desc Ask a new question/doubt
// @route POST /api/questions
// @access Private/Student
const askQuestion = async (req, res) => {
  try {
    const { subject, title, description } = req.body;
    if (!subject || !title || !description) {
      return res.status(400).json({ message: 'Please provide subject, title, and description' });
    }

    const question = await Question.create({
      student: req.user._id,
      studentName: req.user.name,
      subject,
      title,
      description,
      status: 'Pending',
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error posting question: ' + error.message });
  }
};

// @desc Get student's own questions
// @route GET /api/questions/my
// @access Private/Student
const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions: ' + error.message });
  }
};

// @desc Get all questions (for mentors/admins)
// @route GET /api/questions
// @access Private/Mentor/Admin
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions: ' + error.message });
  }
};

// @desc Answer a question
// @route PUT /api/questions/:id/answer
// @access Private/Mentor/Admin
const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer || !answer.trim()) {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.answer = answer.trim();
    question.status = 'Answered';
    question.mentor = req.user._id;
    question.mentorName = req.user.name;
    question.answeredAt = new Date();

    const updated = await question.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error answering question: ' + error.message });
  }
};

module.exports = {
  askQuestion,
  getMyQuestions,
  getAllQuestions,
  answerQuestion,
};
