import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ [MongoDB] MONGODB_URI is not defined in environment variables.');
    return;
  }

  // Safely display masked URI in console (hiding password)
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:********@');
  console.log(`🔌 [MongoDB] Connecting to: ${maskedUri}`);

  try {
    // Disable buffering so queries fail immediately with clear feedback instead of hanging 10s if DB is down
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    console.log(`📂 [MongoDB Atlas] Database: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`❌ [MongoDB Atlas] Connection failed: ${error.message}`);

    if (error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
      console.warn('👉 DNS resolution issue. Please ensure your internet connection is active and MongoDB Atlas host is correct.');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.warn('👉 Authentication failed. Please verify your MongoDB Atlas username and password in backend/.env.');
    } else if (error.message.includes('timed out') || error.message.includes('EPERM')) {
      console.warn('👉 Connection timed out. In MongoDB Atlas, verify Network Access has your IP whitelisted (or 0.0.0.0/0).');
    }
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('🟢 [MongoDB] State: Connected');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️ [MongoDB] State: Disconnected');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('🔄 [MongoDB] State: Reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ [MongoDB] Runtime Error:', err.message);
});

export const getDbStatus = () => ({
  isConnected,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'none',
  dbName: mongoose.connection.name || 'none',
});