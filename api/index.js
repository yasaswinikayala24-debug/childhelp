const app = require('../backend/server.js');
const connectDB = require('../backend/config/db.js');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database initialization error in Vercel function:', err);
  }

  // Restore original request path if Vercel serverless function rewrite changed req.url to /api/index.js
  const originalUrl = req.headers['x-matched-path'] || req.url;
  if (originalUrl && originalUrl !== '/api/index.js') {
    req.url = originalUrl;
  }

  return app(req, res);
};
