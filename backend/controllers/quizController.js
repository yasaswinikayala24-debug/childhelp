const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get all available quizzes (without exposing correctAnswer)
// @route   GET /api/quizzes
// @access  Public / Protected
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer').sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error while fetching quizzes' });
  }
};

// @desc    Get single quiz by ID (without exposing correctAnswer)
// @route   GET /api/quizzes/:id
// @access  Protected
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    res.status(500).json({ message: 'Server error while fetching quiz' });
  }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Protected
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, subject, classLevel, questions } = req.body;

    if (!title || !description || !subject || !classLevel || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Please provide all required quiz fields' });
    }

    const newQuiz = new Quiz({
      title,
      description,
      subject,
      classLevel,
      questions,
      createdBy: req.user ? req.user.id || req.user._id : null,
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error while creating quiz' });
  }
};

// @desc    Submit a quiz attempt and calculate score on backend
// @route   POST /api/quizzes/:id/submit
// @access  Protected
exports.submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Array of { questionId, selectedAnswer }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    // Retrieve full quiz from database WITH correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctAnswersCount = 0;
    const totalQuestions = quiz.questions.length;
    const processedAnswers = [];

    quiz.questions.forEach((q) => {
      const submittedAnswer = answers.find(
        (a) => a.questionId && a.questionId.toString() === q._id.toString()
      );

      const selectedAnswer = submittedAnswer ? submittedAnswer.selectedAnswer : '';
      const isCorrect = selectedAnswer && selectedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        correctAnswersCount += 1;
      }

      processedAnswers.push({
        questionId: q._id,
        selectedAnswer: selectedAnswer || 'Not Answered',
        isCorrect: Boolean(isCorrect),
      });
    });

    const score = correctAnswersCount;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

    // Save student's attempt to MongoDB
    const attempt = new QuizAttempt({
      student: req.user.id || req.user._id,
      quiz: quiz._id,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      percentage,
      answers: processedAnswers,
      completedAt: new Date(),
    });

    const savedAttempt = await attempt.save();

    res.status(200).json({
      message: 'Quiz submitted successfully',
      attemptId: savedAttempt._id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score,
      correctAnswers: correctAnswersCount,
      totalQuestions,
      percentage,
      completedAt: savedAttempt.completedAt,
    });
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    res.status(500).json({ message: 'Server error while evaluating quiz submission' });
  }
};

// @desc    Update an existing quiz
// @route   PUT /api/quizzes/:id
// @access  Protected (Admin only)
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, subject, classLevel, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (subject) quiz.subject = subject;
    if (classLevel) quiz.classLevel = classLevel;
    if (questions && Array.isArray(questions)) quiz.questions = questions;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Server error while updating quiz' });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Protected (Admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Server error while deleting quiz' });
  }
};

