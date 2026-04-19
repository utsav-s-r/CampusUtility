import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware Setup
// ============================================

// Security middleware
app.use(helmet()); // Set security HTTP headers

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// ============================================
// Routes Setup (Placeholder)
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: process.env.APP_NAME || 'Smart Campus Utility App',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// ============================================
// API Routes
// ============================================
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/bookings', bookingRoutes);

// ============================================
// Error Handling & 404
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://${process.env.HOST || 'localhost'}:${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`✅ CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
