const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_media';

    if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
      try {
        console.log('Connecting to local MongoDB...');
        const conn = await mongoose.connect(dbUrl, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
        return;
      } catch (err) {
        console.log('Local MongoDB connection failed. Initializing In-Memory MongoDB Server...');
        mongod = await MongoMemoryServer.create();
        dbUrl = mongod.getUri();
      }
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
