const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const generateHexId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + randomHex;
};

const setupInMemoryStore = () => {
  console.log('Enabling local in-memory fallback for MongoDB models...');
  const User = require('../models/User');

  const usersStore = new Map();

  // Seed sample default users
  const seedDefaultUsers = async () => {
    try {
      const salt = await bcrypt.genSalt(10);
      const sampleUsers = [
        { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: await bcrypt.hash('ChildHelp2026!', salt), role: 'student' },
        { name: 'Priya Patel', email: 'priya@gmail.com', password: await bcrypt.hash('ChildHelp2026!', salt), role: 'student' },
        { name: 'Ankit Kumar', email: 'ankit@gmail.com', password: await bcrypt.hash('ChildHelp2026!', salt), role: 'student' },
        { name: 'Dr. Vikram Sarabhai', email: 'vikram@gmail.com', password: await bcrypt.hash('ChildHelp2026!', salt), role: 'mentor' },
        { name: 'Prof. Sunita Rao', email: 'sunita@gmail.com', password: await bcrypt.hash('ChildHelp2026!', salt), role: 'mentor' },
        { name: 'ChildHelp Admin', email: 'admin@childhelp.org', password: await bcrypt.hash('ChildHelp2026!', salt), role: 'admin' },
      ];
      sampleUsers.forEach((u) => {
        usersStore.set(u.email.toLowerCase(), {
          _id: generateHexId(),
          ...u,
          createdAt: new Date(),
        });
      });
      console.log('Seeded default in-memory users.');
    } catch (e) {
      console.error('Error seeding default in-memory users:', e.message);
    }
  };
  seedDefaultUsers();

  User.findOne = function (query) {
    if (query && query.email) {
      const cleanEmail = String(query.email).toLowerCase().trim();
      const user = usersStore.get(cleanEmail);
      if (user) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(null);
  };

  User.findById = function (id) {
    for (const u of usersStore.values()) {
      if (String(u._id) === String(id)) {
        const userObj = { ...u };
        userObj.select = function (fields) {
          if (fields === '-password') {
            delete userObj.password;
          }
          return Promise.resolve(userObj);
        };
        return userObj;
      }
    }
    const nullObj = null;
    return {
      select: () => Promise.resolve(null),
    };
  };

  User.create = function (doc) {
    const cleanEmail = doc.email.toLowerCase().trim();
    const newUser = {
      _id: generateHexId(),
      name: doc.name,
      email: cleanEmail,
      password: doc.password,
      role: doc.role || 'student',
      createdAt: new Date(),
    };
    usersStore.set(cleanEmail, newUser);
    return Promise.resolve(newUser);
  };
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/childhelp', {
      dbName: 'childhelp',
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.log('Primary MongoDB connection unavailable. Activating fallback storage so server stays online.');
    setupInMemoryStore();
  }
};

module.exports = connectDB;

