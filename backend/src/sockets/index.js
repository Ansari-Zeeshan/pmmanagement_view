import { Server } from 'socket.io';
import { verifyIdToken } from '../config/firebaseAdmin.js';
import { User } from '../modules/user/user.model.js';
import logger from '../utils/logger.js';

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
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
