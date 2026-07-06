import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pv-platform';
const MONGODB_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
};

let isConnected = false;

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.log('📦 Database already connected');
    return;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    isConnected = false;
    throw error;
  }
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log('📦 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Check if database is connected
 */
export const checkDatabaseConnection = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

/**
 * Get database connection status
 */
export const getDatabaseStatus = (): {
  connected: boolean;
  readyState: number;
  name?: string;
} => {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name || undefined,
  };
};

// Export mongoose for use in models
export { mongoose };

// Export all models
export { User } from './models/User';
export { Project } from './models/Project';
export { Client } from './models/Client';
export { Skill } from './models/Skill';
export { Service } from './models/Service';
export { Resume } from './models/Resume';
export { Company } from './models/Company';
export { Job } from './models/Job';
export { Invoice } from './models/Invoice';
export { Payment } from './models/Payment';
export { Notification } from './models/Notification';
export { Setting } from './models/Setting';
export { Media } from './models/Media';
export { Activity } from './models/Activity';
export { Tag } from './models/Tag';
export { Category } from './models/Category';