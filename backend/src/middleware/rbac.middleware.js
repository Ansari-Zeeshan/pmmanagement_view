import { ROLES } from '../modules/user/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Granular permissions mapping to roles
export const PERMISSIONS = {
  'project:create': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER],
  'project:read': Object.values(ROLES),
  'project:update': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER],
  'project:delete': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN],
  'task:create': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_LEAD],
  'task:read': Object.values(ROLES),
  'task:update': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE],
  'task:delete': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER],
  'budget:create': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER, ROLES.FINANCE],
  'budget:approve': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.FINANCE],
  'user:manage': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN],
  'file:upload': Object.values(ROLES),
  'report:view': [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER, ROLES.FINANCE],
  'chat:send': Object.values(ROLES),
};

export const authorize = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'UNAUTHORIZED', 'User not authenticated.', 401);
    }

    const allowedRoles = PERMISSIONS[permission] || [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN];
    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        'FORBIDDEN',
        `Access denied. Requires permission: ${permission}`,
        403
      );
    }

    next();
  };
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        'FORBIDDEN',
        'You do not have permission to perform this action.',
        403
      );
    }
    next();
  };
};
