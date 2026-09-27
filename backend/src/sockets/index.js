import { Server } from 'socket.io';
import { verifyIdToken } from '../config/firebaseAdmin.js';
import { User } from '../modules/user/user.model.js';
import logger from '../utils/logger.js';

export const initSocketServer = (httpServer) => {
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

  const io = new Server(httpServer, {
    cors: {
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
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  });

  // Authentication Middleware for Sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Socket authentication token missing.'));
      }

      const decodedToken = await verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      if (!user) {
        return next(new Error('Socket user not resolved.'));
      }

      socket.user = user;
      socket.organizationId = user.organizationId.toString();
      next();
    } catch (error) {
      logger.warn(`Socket Auth Failure: ${error.message}`);
      next(new Error('Socket authentication failed.'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    logger.info(`Socket connected: User ${user.name} (${user._id})`);

    // Join Rooms
    socket.join(`org:${socket.organizationId}`);
    socket.join(`user:${user._id.toString()}`);

    // Presence broadcast
    io.to(`org:${socket.organizationId}`).emit('presence:status', {
      userId: user._id,
      status: 'online',
    });

    // Join Project Room
    socket.on('project:join', (projectId) => {
      socket.join(`project:${projectId}`);
      logger.debug(`User ${user.name} joined project room: project:${projectId}`);
    });

    socket.on('project:leave', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // Typing Indicators
    socket.on('chat:typing', ({ conversationId, isTyping }) => {
      socket.to(`org:${socket.organizationId}`).emit('chat:typing', {
        conversationId,
        userId: user._id,
        userName: user.name,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: User ${user.name}`);
      io.to(`org:${socket.organizationId}`).emit('presence:status', {
        userId: user._id,
        status: 'offline',
      });
    });
  });

  return io;
};
