const app = require('../backend/server.js');
const connectDB = require('../backend/config/db.js');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database initialization error in Vercel function:', err);
  }
  return app(req, res);
};
