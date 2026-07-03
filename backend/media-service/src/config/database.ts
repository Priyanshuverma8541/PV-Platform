import mongoose from 'mongoose';

export async function connectDatabase(databaseUrl: string): Promise<void> {
  try {
    await mongoose.connect(databaseUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Database disconnection error:', error);
    throw error;
  }
}