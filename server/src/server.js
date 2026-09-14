import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { initFirebaseAdmin } from './config/firebaseAdmin.js';
import { initSocketServer } from './sockets/index.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect MongoDB
  await connectDB();

  // 2. Initialize Firebase Admin SDK
  initFirebaseAdmin();

  // 3. Create HTTP & Socket.IO Servers
  const httpServer = http.createServer(app);
  initSocketServer(httpServer);

  // 4. Start Listening
  httpServer.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`API Base URL: http://localhost:${PORT}/api/v1`);
  });
};

startServer().catch((error) => {
  logger.error(`Fatal Server Error: ${error.message}`);
});
