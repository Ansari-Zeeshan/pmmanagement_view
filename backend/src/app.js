import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { ApiResponse } from './utils/apiResponse.js';
import logger from './utils/logger.js';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3003',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate Limiter (1000 requests per 15 mins for development flexibility)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded.' } },
});
app.use(limiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount Versioned API Routes
app.use('/api/v1', routes);

// 404 Route Handler
app.use((req, res) => {
  return ApiResponse.error(res, 'NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`, 404);
});

// Centralized Error Handler (Phase 31)
app.use((err, req, res, next) => {
  logger.error(`Global Error Handler: ${err.message}`, { stack: err.stack });
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message;
  return ApiResponse.error(res, code, message, statusCode);
});

export default app;
