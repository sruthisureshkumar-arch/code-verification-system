import { MongoClient } from 'mongodb';

let dbInstance = null;
let clientInstance = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
    clientInstance = new MongoClient(uri);

    await clientInstance.connect();

    dbInstance = clientInstance.db('auto-exec-system');

    console.log(`MongoDB Connected: ${clientInstance.options.srvHost || '127.0.0.1'} (Native Driver)`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Returns the active MongoDB database instance
 */
export const getDB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbInstance;
};

export default connectDB;
