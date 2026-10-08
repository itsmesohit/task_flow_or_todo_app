import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, getDbStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB Atlas
connectDB();

// Middleware
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [allowedOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[API] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: dbStatus.isConnected,
      readyState: dbStatus.readyState,
      host: dbStatus.host,
      name: dbStatus.dbName,
    },
  });
});

// Database connectivity check for API routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Database is not connected. In MongoDB Atlas, please ensure your current IP address is whitelisted under Network Access, and verify your credentials in backend/.env.',
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 [TaskFlow API] Server running on http://localhost:${PORT}`);
  console.log(`📡 [Health Check] http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = Number(PORT) + 1;
    console.warn(`⚠️ Port ${PORT} is in use. Attempting fallback port ${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`🚀 [TaskFlow API] Server running on fallback port http://localhost:${fallbackPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
