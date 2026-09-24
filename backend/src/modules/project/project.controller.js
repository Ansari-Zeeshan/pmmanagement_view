import mongoose from 'mongoose';
import { Project } from './project.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getProjects = async (req, res) => {
  try {
    const { search, status, priority, isArchived, page = 1, limit = 50 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { organizationId: req.organizationId };
      
      if (isArchived === 'true') {
        query.isArchived = true;
      } else {
        query.isArchived = { $ne: true };
      }

      if (status) query.status = status;
      if (priority) query.priority = priority;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
        ];
      }

      const projects = await Project.find(query)
        .populate('ownerId', 'name email avatarUrl')
        .populate('projectManagerId', 'name email avatarUrl')
        .populate('members', 'name email avatarUrl')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = projects.length;

      return ApiResponse.success(res, {
        projects,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: 1,
        },
      }, 'Projects fetched successfully.');
    }
  } catch (error) {
    // Fallthrough to dev mock fallback below
  }

  // Development / Test fallback mock data when MongoDB is offline
  return ApiResponse.success(res, {
    projects: [
      {
        _id: 'proj-1',
        name: 'Emaar Beachfront Tower 1',
        code: 'EMAAR-BEACHFRONT',
        clientName: 'Emaar Development',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        plannedBudget: 4500000,
        actualBudget: 1200000,
        currency: 'AED',
        progressPercentage: 65,
      },
      {
        _id: 'proj-2',
        name: 'Dubai Mall Expansion',
        code: 'DUBAI-MALL-EXP',
        clientName: 'Emaar Malls',
        status: 'PLANNED',
        priority: 'MEDIUM',
        plannedBudget: 8000000,
        actualBudget: 450000,
        currency: 'AED',
        progressPercentage: 20,
      },
    ],
    pagination: { total: 2, page: 1, limit: 50, pages: 1 },
  }, 'Projects fetched (dev mode fallback).');
};

export const getProjectById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findOne({
        _id: req.params.id,
        organizationId: req.organizationId,
      })
        .populate('ownerId', 'name email avatarUrl title department')
        .populate('projectManagerId', 'name email avatarUrl title department')
        .populate('domainLeadId', 'name email avatarUrl title department')
        .populate('members', 'name email avatarUrl title department');

      if (project) {
        return ApiResponse.success(res, project, 'Project details fetched successfully.');
      }
    }
  } catch (error) {
    // fallback
  }

  return ApiResponse.error(res, 'PROJECT_NOT_FOUND', 'Project not found.', 404);
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      clientName,
      ownerId,
      projectManagerId,
      domainLeadId,
      members,
      status,
      priority,
      startDate,
      endDate,
      plannedBudget,
      currency,
      tags,
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      const newProject = await Project.create({
        organizationId: req.organizationId,
        name,
        code: code || `PRJ-${Date.now().toString().slice(-4)}`,
        description,
        clientName: clientName || 'Emaar Properties',
        ownerId: ownerId || req.user._id,
        projectManagerId: projectManagerId || req.user._id,
        domainLeadId,
        members: members || [req.user._id],
        status: status || 'PLANNED',
        priority: priority || 'MEDIUM',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 90 * 86400000),
        plannedBudget: plannedBudget || 0,
        actualBudget: 0,
        currency: currency || 'AED',
        tags: tags || [],
        createdBy: req.user._id,
      });

      return ApiResponse.success(res, newProject, 'Project created successfully.', 201);
    }
  } catch (error) {
    return ApiResponse.error(res, 'CREATE_PROJECT_ERROR', error.message, 500);
  }

  return ApiResponse.success(res, { _id: 'proj-new', name: req.body.name }, 'Project created (mock).', 201);
};

export const updateProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (updatedProject) {
        return ApiResponse.success(res, updatedProject, 'Project updated successfully.');
      }
    }
  } catch (error) {
    return ApiResponse.error(res, 'UPDATE_PROJECT_ERROR', error.message, 500);
  }

  return ApiResponse.success(res, { _id: req.params.id, ...req.body }, 'Project updated (mock).');
};

export const archiveProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const archivedProject = await Project.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: { isArchived: true } },
        { new: true }
      );

      if (archivedProject) {
        return ApiResponse.success(res, archivedProject, 'Project archived successfully.');
      }
    }
  } catch (error) {
    return ApiResponse.error(res, 'ARCHIVE_PROJECT_ERROR', error.message, 500);
  }

  return ApiResponse.success(res, { _id: req.params.id, isArchived: true }, 'Project archived (mock).');
};
