const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educms_db';
    
    await mongoose.connect(mongoURI, {
      // Connection pool settings
      maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE || 10),
      minPoolSize: 5,
      
      // Timeout settings
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT || 30000),
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Connection monitoring
      monitorCommands: false,
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`   Connected to: ${mongoose.connection.host}:${mongoose.connection.port}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected - attempting to reconnect...');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Only log these in development
if (process.env.NODE_ENV === 'development') {
  mongoose.connection.on('connecting', () => {
    console.log('⏳ MongoDB connecting...');
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = { connectDB, mongoose };
