const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const noteRoutes = require('./routes/noteRoutes');
const progressRoutes = require('./routes/progressRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const quizRoutes = require('./routes/quizRoutes');
const quizAttemptRoutes = require('./routes/quizAttemptRoutes');
const Quiz = require('./models/Quiz');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  try {
    // Seed initial test quizzes if collection is empty
    const count = await Quiz.countDocuments();
    if (count === 0) {
      await Quiz.create([
        {
          title: 'Basic Python Quiz',
          description: 'Test your Python fundamentals and basic programming concepts.',
          subject: 'Programming',
          classLevel: '10',
          questions: [
            {
              questionText: 'Which keyword is used to define a function in Python?',
              options: ['function', 'def', 'func', 'define'],
              correctAnswer: 'def',
            },
            {
              questionText: 'How do you output text to the console in Python?',
              options: ['console.log()', 'print()', 'echo()', 'output()'],
              correctAnswer: 'print()',
            },
            {
              questionText: 'Which data type is used to store text in Python?',
              options: ['str', 'int', 'float', 'bool'],
              correctAnswer: 'str',
            },
            {
              questionText: 'Which symbol is used for comments in Python?',
              options: ['//', '/* */', '#', '<!-- -->'],
              correctAnswer: '#',
            },
            {
              questionText: 'What is the result of 5 ** 2 in Python?',
              options: ['10', '25', '7', '52'],
              correctAnswer: '25',
            },
          ],
        },
        {
          title: 'Basic Science Quiz',
          description: 'Test your understanding of elementary physics, biology, and chemistry concepts.',
          subject: 'Science',
          classLevel: '10',
          questions: [
            {
              questionText: 'What gas do plants absorb from the atmosphere during photosynthesis?',
              options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
              correctAnswer: 'Carbon Dioxide',
            },
            {
              questionText: 'What is the chemical symbol for Water?',
              options: ['CO2', 'H2O', 'O2', 'NaCl'],
              correctAnswer: 'H2O',
            },
            {
              questionText: 'Which organ in the human body pumps blood?',
              options: ['Lungs', 'Brain', 'Heart', 'Liver'],
              correctAnswer: 'Heart',
            },
            {
              questionText: 'What is the boiling point of pure water at sea level?',
              options: ['50°C', '80°C', '100°C', '120°C'],
              correctAnswer: '100°C',
            },
            {
              questionText: 'Which planet is known as the Red Planet?',
              options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
              correctAnswer: 'Mars',
            },
          ],
        },
      ]);
      console.log('Seeded initial test quizzes');
    }
  } catch (err) {
    console.error('Error seeding test quizzes:', err);
  }
});

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'ChildHelp API is running' });
});

// Authentication & Core API routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Phase 3 Quiz & Progress routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-attempts', quizAttemptRoutes);

// Error handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
