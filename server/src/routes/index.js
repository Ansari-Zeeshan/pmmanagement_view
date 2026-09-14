import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

import { getMe, registerOrganization } from '../modules/auth/auth.controller.js';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  archiveProject,
} from '../modules/project/project.controller.js';
import {
  getProjectTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  deleteTask,
} from '../modules/task/task.controller.js';
import {
  getProjectBudgetSummary,
  createBudgetTransaction,
  approveBudgetTransaction,
} from '../modules/budget/budget.controller.js';
import { getMyNotifications, markAsRead, markAllAsRead } from '../modules/notification/notification.controller.js';
import { getDashboardMetrics } from '../modules/dashboard/dashboard.controller.js';
import { getConversations, getMessages, sendMessage } from '../modules/chat/chat.controller.js';
import { globalSearch } from '../modules/search/search.controller.js';
import { User } from '../modules/user/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Authenticated Routes Mount
router.use(authenticate);

// Auth & Org
router.get('/auth/me', getMe);
router.post('/auth/organization', registerOrganization);

// Dashboard
router.get('/dashboard/metrics', getDashboardMetrics);

// Users / Employees
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ organizationId: req.organizationId }).select('-firebaseUid');
    return ApiResponse.success(res, users, 'Users fetched.');
  } catch (error) {
    return ApiResponse.error(res, 'USERS_FETCH_ERROR', error.message, 500);
  }
});

// Projects
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', authorize('project:create'), createProject);
router.patch('/projects/:id', authorize('project:update'), updateProject);
router.delete('/projects/:id', authorize('project:delete'), archiveProject);

// Tasks
router.get('/projects/:projectId/tasks', getProjectTasks);
router.get('/tasks', getProjectTasks); // All org tasks
router.post('/tasks', authorize('task:create'), createTask);
router.patch('/tasks/reorder', authorize('task:update'), reorderTasks);
router.patch('/tasks/:id', authorize('task:update'), updateTask);
router.patch('/tasks/:id/status', authorize('task:update'), updateTaskStatus);
router.delete('/tasks/:id', authorize('task:delete'), deleteTask);

// Budget
router.get('/projects/:projectId/budget', getProjectBudgetSummary);
router.post('/budget/transactions', authorize('budget:create'), createBudgetTransaction);
router.patch('/budget/transactions/:id/approve', authorize('budget:approve'), approveBudgetTransaction);

// Notifications
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markAsRead);
router.patch('/notifications/read-all', markAllAsRead);

// Chat
router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);

// Global Search
router.get('/search', globalSearch);

export default router;
