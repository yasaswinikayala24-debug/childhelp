const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Material = require('./models/Material');

dotenv.config();

const sampleUsers = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    password: 'password123',
    role: 'student',
  },
  {
    name: 'Priya Patel',
    email: 'priya@gmail.com',
    password: 'password123',
    role: 'student',
  },
  {
    name: 'Ankit Kumar',
    email: 'ankit@gmail.com',
    password: 'password123',
    role: 'student',
  },
  {
    name: 'Dr. Vikram Sarabhai',
    email: 'vikram@gmail.com',
    password: 'password123',
    role: 'mentor',
  },
  {
    name: 'Prof. Sunita Rao',
    email: 'sunita@gmail.com',
    password: 'password123',
    role: 'mentor',
  },
  {
    name: 'ChildHelp Admin',
    email: 'admin@childhelp.org',
    password: 'adminpassword123',
    role: 'admin',
  },
];

const sampleMaterials = [
  {
    title: 'Class 10 Algebra & Quadratic Equations Comprehensive Guide',
    description: 'Master quadratic formulas, factorization, real-root determinations, and solved practice questions for Class 10 mathematics examinations.',
    subject: 'Mathematics',
    classLevel: 'Class 10',
    type: 'PDF',
    resourceUrl: 'https://ncert.nic.in/textbook/pdf/jemh104.pdf',
  },
  {
    title: 'Fundamental Physics: Motion, Forces & Laws of Motion Explained',
    description: 'A visual video walkthrough explaining Newton laws of motion, velocity-time graphs, and momentum equations for Class 9 science students.',
    subject: 'Science',
    classLevel: 'Class 9',
    type: 'VIDEO',
    resourceUrl: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
  },
  {
    title: 'Complete English Grammar, tenses & Essay Writing Handbook',
    description: 'Comprehensive study guide covering sentence structures, active/passive voice, idioms, phrases, and formal letter writing templates.',
    subject: 'English',
    classLevel: 'Class 8',
    type: 'PDF',
    resourceUrl: 'https://www.w3schools.com/grammar/',
  },
  {
    title: 'Introduction to JavaScript & Building Web Pages for Beginners',
    description: 'Learn modern programming concepts including variables, loops, arrays, functions, and interactive DOM manipulation using JavaScript.',
    subject: 'Programming',
    classLevel: 'Class 10',
    type: 'VIDEO',
    resourceUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
  },
  {
    title: 'World Geography, Solar System & Environmental Science Notes',
    description: 'Interactive reference notes covering earth layers, atmospheric pressure belts, ocean currents, and global conservation awareness.',
    subject: 'General Knowledge',
    classLevel: 'Class 8',
    type: 'LINK',
    resourceUrl: 'https://www.nationalgeographic.com/education',
  },
  {
    title: 'Class 12 Organic Chemistry Mechanisms & Hydrocarbon Reactions',
    description: 'Detailed reaction mechanisms, electrophilic additions, resonance structures, and functional group conversions for board exams.',
    subject: 'Science',
    classLevel: 'Class 12',
    type: 'PDF',
    resourceUrl: 'https://ncert.nic.in/textbook/pdf/lech201.pdf',
  },
  {
    title: 'Python Programming Basics for Young Learners',
    description: 'Beginner-friendly tutorial covering Python syntax, data types, logic building, problem solving, and basic math algorithms.',
    subject: 'Programming',
    classLevel: 'Class 9',
    type: 'LINK',
    resourceUrl: 'https://docs.python.org/3/tutorial/index.html',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/childhelp';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri, { dbName: 'childhelp' });
    console.log('MongoDB Connected successfully!');

    // Clean existing users with sample emails
    const emailsToClean = sampleUsers.map((u) => u.email);
    await User.deleteMany({ email: { $in: emailsToClean } });
    console.log('Cleaned pre-existing seed users.');

    // Prepare users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const preparedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert sample users
    const createdUsers = await User.insertMany(preparedUsers);
    console.log(`✅ Successfully seeded ${createdUsers.length} users into MongoDB!`);

    // Assign mentor user to study materials
    const mentorUser = createdUsers.find((u) => u.role === 'mentor') || createdUsers[0];
    await Material.deleteMany({});
    console.log('Cleaned existing study materials.');

    const preparedMaterials = sampleMaterials.map((m) => ({
      ...m,
      uploadedBy: mentorUser._id,
    }));

    const createdMaterials = await Material.insertMany(preparedMaterials);
    console.log(`✅ Successfully seeded ${createdMaterials.length} study materials into MongoDB!`);

    console.log('\n--------------------------------------------------');
    console.log('Sample Logins:');
    sampleUsers.forEach((u) => {
      console.log(`Role: ${u.role.padEnd(8)} | Email: ${u.email.padEnd(22)} | Password: ${u.password}`);
    });
    console.log('--------------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  const destroyData = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/childhelp', {
        dbName: 'childhelp',
      });
      await User.deleteMany();
      await Material.deleteMany();
      console.log('All Users and Study Materials Destroyed!');
      process.exit(0);
    } catch (error) {
      console.error(`Error destroying data: ${error.message}`);
      process.exit(1);
    }
  };
  destroyData();
} else {
  seedData();
}
