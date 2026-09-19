const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

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
    console.log(`\n✅ Successfully seeded ${createdUsers.length} users into MongoDB!`);
    console.log('--------------------------------------------------');
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
      console.log('All Users Destroyed!');
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
