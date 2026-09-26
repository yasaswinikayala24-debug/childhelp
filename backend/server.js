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
const Material = require('./models/Material');

const path = require('path');

// Load environment variables from backend/.env and root .env
dotenv.config({ path: path.join(__dirname, '.env') });
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

    // Seed initial study materials if collection is empty
    const materialCount = await Material.countDocuments();
    if (materialCount === 0) {
      await Material.create([
        {
          title: 'Mathematics Grade 10: Linear Equations & Algebra',
          description: 'Comprehensive guide covering linear equations, quadratic formulas, and algebraic expressions with step-by-step solved examples.',
          subject: 'Mathematics',
          classLevel: '10',
          type: 'PDF',
          resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          difficulty: 'Intermediate',
          estimatedTime: 25,
          keywords: ['algebra', 'equations', 'math', 'grade 10'],
        },
        {
          title: 'Physics Fundamentals: Laws of Motion & Energy',
          description: 'Master Newton\'s laws of motion, kinetic energy calculations, and real-world physical force demonstrations.',
          subject: 'Science',
          classLevel: '10',
          type: 'ARTICLE',
          resourceUrl: 'https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion',
          difficulty: 'Beginner',
          estimatedTime: 20,
          keywords: ['physics', 'motion', 'force', 'energy'],
        },
        {
          title: 'Basic Python Programming for Beginners',
          description: 'Learn Python syntax, variables, conditionals, loops, and basic data structures with hands-on coding exercises.',
          subject: 'Programming',
          classLevel: '10',
          type: 'VIDEO',
          resourceUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
          difficulty: 'Beginner',
          estimatedTime: 30,
          keywords: ['python', 'coding', 'programming', 'basics'],
        },
        {
          title: 'English Grammar & Essay Writing Masterclass',
          description: 'Improve reading comprehension, vocabulary, paragraph structure, and narrative essay writing skills.',
          subject: 'English',
          classLevel: '9',
          type: 'PDF',
          resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          difficulty: 'Beginner',
          estimatedTime: 15,
          keywords: ['english', 'grammar', 'essay', 'writing'],
        },
        {
          title: 'Chemistry Basics: Periodic Table & Chemical Bonds',
          description: 'Explore atomic structures, elements of the periodic table, ionic and covalent chemical bonding principles.',
          subject: 'Science',
          classLevel: '9',
          type: 'ARTICLE',
          resourceUrl: 'https://en.wikipedia.org/wiki/Periodic_table',
          difficulty: 'Intermediate',
          estimatedTime: 20,
          keywords: ['chemistry', 'periodic table', 'atoms', 'bonds'],
        },
        {
          title: 'Data Structures & Algorithms Overview',
          description: 'Introduction to Arrays, Linked Lists, Stacks, Queues, Binary Trees, and sorting algorithms.',
          subject: 'Computer Science',
          classLevel: '11',
          type: 'PDF',
          resourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          difficulty: 'Advanced',
          estimatedTime: 40,
          keywords: ['algorithms', 'data structures', 'trees', 'arrays'],
        },
      ]);
      console.log('Seeded initial study materials');
    }

    // Seed initial scholarships if collection is empty
    const scholarshipCount = await Scholarship.countDocuments();
    if (scholarshipCount === 0) {
      await Scholarship.create([
        {
          title: 'National Merit STEM Scholarship 2026',
          description: 'Financial award for outstanding grade 9-12 students excelling in Mathematics, Science, and Technology.',
          provider: 'National Science Foundation',
          eligibility: 'Class 9 to 12 students with minimum 80% aggregate',
          classLevel: 'Class 10',
          deadline: '30 Nov 2026',
          applicationUrl: 'https://www.scholarships.gov.in',
          category: 'STEM',
        },
        {
          title: 'ChildHelp Higher Education Support Grant',
          description: 'Full tuition assistance grant for promising underprivileged students pursuing higher secondary education.',
          provider: 'ChildHelp Educational Trust',
          eligibility: 'All students with household income below 2.5 LPA',
          classLevel: 'All Classes',
          deadline: '15 Dec 2026',
          applicationUrl: 'https://childhelp.org/scholarships',
          category: 'Need-Based',
        },
      ]);
      console.log('Seeded initial scholarships');
    }

    // Seed initial announcements if collection is empty
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      await Announcement.create([
        {
          title: '🎉 Phase 3 Assessment & Progress Tracking Live!',
          message: 'Explore new interactive subject quizzes, view instant score evaluations, and track your learning progress on your dashboard.',
          category: 'System',
          authorName: 'ChildHelp Academic Team',
        },
        {
          title: '📢 Weekly Mentor Doubt Solving Sessions Available',
          message: 'Submit your subject questions under Mentor Support to receive step-by-step guidance from verified educators.',
          category: 'Academic',
          authorName: 'Dr. Vikram Sarabhai',
        },
      ]);
      console.log('Seeded initial announcements');
    }
  } catch (err) {
    console.error('Error seeding test data:', err);
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
app.options('*', cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'ChildHelp API is running' });
});
app.get('/api', (req, res) => {
  res.json({ message: 'ChildHelp API is running' });
});

const scholarshipRoutes = require('./routes/scholarshipRoutes');
const questionRoutes = require('./routes/questionRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const Scholarship = require('./models/Scholarship');
const Announcement = require('./models/Announcement');

// Authentication & Core API routes (supporting both /api/* and /* paths)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/materials', materialRoutes);
app.use('/materials', materialRoutes);

app.use('/api/bookmarks', bookmarkRoutes);
app.use('/bookmarks', bookmarkRoutes);

app.use('/api/notes', noteRoutes);
app.use('/notes', noteRoutes);

app.use('/api/progress', progressRoutes);
app.use('/progress', progressRoutes);

app.use('/api/study-sessions', studySessionRoutes);
app.use('/study-sessions', studySessionRoutes);

app.use('/api/goals', goalRoutes);
app.use('/goals', goalRoutes);

app.use('/api/recommendations', recommendationRoutes);
app.use('/recommendations', recommendationRoutes);

// Quiz & Progress routes
app.use('/api/quizzes', quizRoutes);
app.use('/quizzes', quizRoutes);

app.use('/api/quiz-attempts', quizAttemptRoutes);
app.use('/quiz-attempts', quizAttemptRoutes);

// Scholarships, Mentor Questions & Announcements routes
app.use('/api/scholarships', scholarshipRoutes);
app.use('/scholarships', scholarshipRoutes);

app.use('/api/questions', questionRoutes);
app.use('/questions', questionRoutes);

app.use('/api/announcements', announcementRoutes);
app.use('/announcements', announcementRoutes);

// Error handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
