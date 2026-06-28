import mongoose from 'mongoose';

export async function connectDatabase(connectionString: string): Promise<void> {
  await mongoose.connect(connectionString, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });

  console.log('Connected to MongoDB');
}
