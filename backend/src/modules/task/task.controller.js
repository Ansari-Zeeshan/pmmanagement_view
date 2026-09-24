import { Task } from './task.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assignee, search, priority } = req.query;

    const query = { organizationId: req.organizationId };
    if (projectId && projectId !== 'all') {
      query.projectId = projectId;
    }

    if (status) query.status = status;
    if (assignee) query.assignees = assignee;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { labels: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignees', 'name email avatarUrl title department')
      .populate('createdBy', 'name email avatarUrl')
      .populate('projectId', 'name code')
      .populate('parentTaskId', 'title')
      .sort({ orderIndex: 1, createdAt: -1 });

    return ApiResponse.success(res, tasks, 'Tasks fetched successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'FETCH_TASKS_ERROR', error.message, 500);
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      projectId,
      parentTaskId,
      milestoneId,
      title,
      description,
      assignees,
      status,
      priority,
      labels,
      startDate,
      dueDate,
      estimatedHours,
      plannedCost,
    } = req.body;

    const maxOrder = await Task.findOne({ projectId, organizationId: req.organizationId })
      .sort({ orderIndex: -1 })
      .select('orderIndex');

    const newTask = await Task.create({
      organizationId: req.organizationId,
      projectId: projectId || req.body.projectId,
      parentTaskId,
      milestoneId,
      title,
      description,
      assignees: assignees || [req.user._id],
      status: status || 'TO_DO',
      priority: priority || 'MEDIUM',
      labels: labels || [],
      startDate: startDate ? new Date(startDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 86400000),
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      plannedCost: plannedCost || 0,
      actualCost: 0,
      orderIndex: maxOrder ? maxOrder.orderIndex + 1 : 0,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(newTask._id)
      .populate('assignees', 'name email avatarUrl title department')
      .populate('projectId', 'name code');

    return ApiResponse.success(res, populatedTask, 'Task created successfully.', 201);
  } catch (error) {
    return ApiResponse.error(res, 'CREATE_TASK_ERROR', error.message, 500);
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('assignees', 'name email avatarUrl title department')
      .populate('projectId', 'name code');

    if (!updatedTask) {
      return ApiResponse.error(res, 'TASK_NOT_FOUND', 'Task not found.', 404);
    }

    return ApiResponse.success(res, updatedTask, 'Task updated successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'UPDATE_TASK_ERROR', error.message, 500);
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, orderIndex } = req.body;
    const updateObj = { status };
    if (orderIndex !== undefined) updateObj.orderIndex = orderIndex;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      { $set: updateObj },
      { new: true }
    ).populate('assignees', 'name email avatarUrl title department');

    if (!task) {
      return ApiResponse.error(res, 'TASK_NOT_FOUND', 'Task not found.', 404);
    }

    return ApiResponse.success(res, task, 'Task status updated.');
  } catch (error) {
    return ApiResponse.error(res, 'UPDATE_STATUS_ERROR', error.message, 500);
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, orderIndex, status }
    if (!Array.isArray(items)) {
      return ApiResponse.error(res, 'INVALID_INPUT', 'Items must be an array.', 400);
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id, organizationId: req.organizationId },
        update: { $set: { orderIndex: item.orderIndex, status: item.status } },
      },
    }));

    await Task.bulkWrite(bulkOps);
    return ApiResponse.success(res, null, 'Tasks reordered successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'REORDER_ERROR', error.message, 500);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!deletedTask) {
      return ApiResponse.error(res, 'TASK_NOT_FOUND', 'Task not found.', 404);
    }

    return ApiResponse.success(res, null, 'Task deleted successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'DELETE_TASK_ERROR', error.message, 500);
  }
};
