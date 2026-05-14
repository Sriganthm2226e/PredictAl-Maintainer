// server/config/db.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB Atlas using the connection string from .env.
 */
function connectDB() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    logger.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info('MongoDB connected'))
    .catch((err) => {
      logger.error('MongoDB connection error (running in mock/offline mode):', err.message);
    });
}

module.exports = connectDB;
