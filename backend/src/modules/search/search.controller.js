import { Project } from '../project/project.model.js';
import { Task } from '../task/task.model.js';
import { User } from '../user/user.model.js';
import { RequestWorkflow } from '../request/request.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return ApiResponse.success(res, { projects: [], tasks: [], users: [], requests: [] }, 'Empty search query.');
    }

    const orgId = req.organizationId;
    const regex = new RegExp(q, 'i');

    const [projects, tasks, users, requests] = await Promise.all([
      Project.find({ organizationId: orgId, $or: [{ name: regex }, { code: regex }, { clientName: regex }] })
        .limit(10)
        .select('name code status clientName priority'),

      Task.find({ organizationId: orgId, $or: [{ title: regex }, { description: regex }, { labels: regex }] })
        .limit(15)
        .populate('projectId', 'name code')
        .select('title status priority dueDate projectId'),

      User.find({ organizationId: orgId, $or: [{ name: regex }, { email: regex }, { department: regex }] })
        .limit(10)
        .select('name email title avatarUrl department role'),

      RequestWorkflow.find({ organizationId: orgId, $or: [{ title: regex }, { requestCode: regex }] })
        .limit(10)
        .select('title requestCode requestType status priority'),
    ]);

    return ApiResponse.success(res, { projects, tasks, users, requests }, 'Search results retrieved.');
  } catch (error) {
    return ApiResponse.error(res, 'SEARCH_ERROR', error.message, 500);
  }
};
