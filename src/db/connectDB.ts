import mongoose from 'mongoose';
const { MONGO_URI } = process.env;

export const connectToMongoDB = (): void => {
  if (!MONGO_URI) {
    console.error('Mongo URI is not defined');
    process.exit(1);
  }
  mongoose.connect(MONGO_URI as string);
  mongoose.connection.on('connected', () => {
    console.info(`Connected to MongoDB`);
  });

  mongoose.connection.on('error', (err) => {
    console.info(`Error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.info('Disconnected from MongoDB');
  });
};