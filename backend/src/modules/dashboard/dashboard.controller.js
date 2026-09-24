import { Project } from '../project/project.model.js';
import { Task } from '../task/task.model.js';
import { User } from '../user/user.model.js';
import { RequestWorkflow } from '../request/request.model.js';
import { Notification } from '../notification/notification.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const orgId = req.organizationId;

    // Total Projects Breakdown
    const totalProjects = await Project.countDocuments({ organizationId: orgId, isArchived: { $ne: true } });
    const activeProjects = await Project.countDocuments({ organizationId: orgId, status: 'IN_PROGRESS' });
    const completedProjects = await Project.countDocuments({ organizationId: orgId, status: 'COMPLETED' });
    const plannedProjects = await Project.countDocuments({ organizationId: orgId, status: 'PLANNED' });
    const atRiskProjects = await Project.countDocuments({ organizationId: orgId, priority: 'CRITICAL', status: 'IN_PROGRESS' });

    // Task Analytics
    const totalTasks = await Task.countDocuments({ organizationId: orgId });
    const completedTasks = await Task.countDocuments({ organizationId: orgId, status: 'COMPLETED' });
    const inProgressTasks = await Task.countDocuments({ organizationId: orgId, status: 'IN_PROGRESS' });
    const overdueTasks = await Task.countDocuments({
      organizationId: orgId,
      status: { $ne: 'COMPLETED' },
      dueDate: { $lt: new Date() },
    });

    // Budget Aggregations
    const budgetStats = await Project.aggregate([
      { $match: { organizationId: orgId, isArchived: { $ne: true } } },
      {
        $group: {
          _id: null,
          totalPlanned: { $sum: '$plannedBudget' },
          totalActual: { $sum: '$actualBudget' },
        },
      },
    ]);

    const totalPlannedBudget = budgetStats[0]?.totalPlanned || 0;
    const totalActualBudget = budgetStats[0]?.totalActual || 0;

    // Pending Requests & Notifications
    const pendingRequests = await RequestWorkflow.countDocuments({ organizationId: orgId, status: 'SUBMITTED' });
    const unreadNotifications = await Notification.countDocuments({ recipientId: req.user._id, isRead: false });

    // Employee Capacity Breakdown
    const totalEmployees = await User.countDocuments({ organizationId: orgId, isActive: true });

    return ApiResponse.success(res, {
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        planned: plannedProjects,
        atRisk: atRiskProjects,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
      },
      financials: {
        plannedBudget: totalPlannedBudget,
        actualBudget: totalActualBudget,
        utilizationPercentage: totalPlannedBudget > 0 ? Math.round((totalActualBudget / totalPlannedBudget) * 100) : 0,
        currency: 'AED',
      },
      resources: {
        totalEmployees,
      },
      pendingRequests,
      unreadNotifications,
    }, 'Dashboard metrics computed successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'DASHBOARD_METRICS_ERROR', error.message, 500);
  }
};
