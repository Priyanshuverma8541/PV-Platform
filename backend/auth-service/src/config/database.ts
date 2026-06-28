import mongoose from 'mongoose';

export async function connectDatabase(connectionString: string): Promise<void> {
  await mongoose.connect(connectionString, {
    autoIndex: true,
  });

  console.log('Connected to MongoDB');
}
