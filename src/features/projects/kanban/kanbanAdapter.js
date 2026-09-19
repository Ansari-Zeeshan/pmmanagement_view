/**
 * EMAAR Enterprise Kanban Board Data Adapter
 * Maps application task data to enterprise Kanban columns and enriches real-estate context.
 */

// 5 Standard Enterprise Kanban Columns
export const KANBAN_COLUMNS = [
  {
    id: 'BACKLOG',
    title: 'BACKLOG',
    dotClass: 'backlog',
    badgeBg: 'bg-secondary',
    allowedStatuses: ['Backlog', 'New', 'Unplanned', 'Planned', 'BACKLOG'],
    defaultStatus: 'Planned',
  },
  {
    id: 'TO_DO',
    title: 'TO DO',
    dotClass: 'todo',
    badgeBg: 'bg-primary',
    allowedStatuses: ['To Do', 'TO_DO', 'Ready', 'Ready to begin'],
    defaultStatus: 'Ready to begin',
  },
  {
    id: 'IN_PROGRESS',
    title: 'IN PROGRESS',
    dotClass: 'in_progress',
    badgeBg: 'bg-info',
    allowedStatuses: ['In Progress', 'IN_PROGRESS', 'On Track', 'In Execution', 'Under Construction'],
    defaultStatus: 'On Track',
  },
  {
    id: 'REVIEW',
    title: 'REVIEW',
    dotClass: 'review',
    badgeBg: 'bg-warning',
    allowedStatuses: ['Review', 'IN_REVIEW', 'At Risk', 'Pending Review', 'Approval', 'Inspection'],
    defaultStatus: 'At Risk',
  },
  {
    id: 'DONE',
    title: 'DONE',
    dotClass: 'done',
    badgeBg: 'bg-success',
    allowedStatuses: ['Done', 'Completed', 'COMPLETED', 'Approved'],
    defaultStatus: 'Approved',
  },
];

/**
 * Maps a task's status string to one of the 5 canonical column IDs.
 */
export const mapStatusToColumnId = (statusStr = '') => {
  if (!statusStr) return 'BACKLOG';

  const normalized = String(statusStr).trim().toUpperCase();

  if (['BACKLOG', 'NEW', 'UNPLANNED', 'PLANNED'].includes(normalized)) return 'BACKLOG';
  if (['TO DO', 'TO_DO', 'READY', 'READY TO BEGIN'].includes(normalized)) return 'TO_DO';
  if (['IN PROGRESS', 'IN_PROGRESS', 'ON TRACK', 'IN EXECUTION', 'UNDER CONSTRUCTION'].includes(normalized))
    return 'IN_PROGRESS';
  if (['REVIEW', 'IN_REVIEW', 'AT RISK', 'PENDING REVIEW', 'APPROVAL', 'INSPECTION', 'ON HOLD'].includes(normalized))
    return 'REVIEW';
  if (['DONE', 'COMPLETED', 'APPROVED'].includes(normalized)) return 'DONE';

  return 'BACKLOG';
};

/**
 * Maps a target column ID to a default status string compatible with the store/backend.
 */
export const getStatusForColumn = (columnId) => {
  const col = KANBAN_COLUMNS.find((c) => c.id === columnId);
  return col ? col.defaultStatus : 'Planned';
};

/**
 * Real-estate task types for EMAAR project management.
 */
export const TASK_TYPES = [
  'Design & Architecture',
  'Construction Phase',
  'Procurement Package',
  'Authority Approval',
  'Site Inspection',
  'MEP Coordination',
  'Quality Audit',
  'Handover',
];

/**
 * Generates or formats real-estate metadata for tasks.
 */
export const formatTaskMetadata = (task) => {
  const priority = task.priority ? String(task.priority).toUpperCase() : 'MEDIUM';
  const group = task.group || 'Development';
  
  // Real estate context line (e.g. Downtown Tower 01 • Phase 2)
  const propertyContext = task.location || `${group} • Tower ${task._id ? task._id.slice(-2) : 'A'}`;
  
  // Task Type Badge
  let typeBadge = task.type || 'Construction';
  if (!task.type) {
    if (group.toLowerCase().includes('research')) typeBadge = 'Design';
    else if (group.toLowerCase().includes('wireframe')) typeBadge = 'Procurement';
    else if (group.toLowerCase().includes('visual')) typeBadge = 'Approval';
    else typeBadge = 'Construction';
  }

  // Calculate completion percentage or fallback
  let progressPct = task.progress !== undefined ? task.progress : 0;
  if (task.status === 'Approved' || task.status === 'Completed' || task.status === 'Done') {
    progressPct = 100;
  } else if (task.status === 'On Track' || task.status === 'In Progress') {
    progressPct = task.progress || 65;
  } else if (task.status === 'At Risk') {
    progressPct = task.progress || 40;
  } else if (task.status === 'Planned') {
    progressPct = task.progress || 15;
  }

  // Financial budget badge: formatted as "100 AED", "150K AED", etc.
  const rawBudget = task.plannedBudget || '100 AED';
  const cleanVal = String(rawBudget).replace(/AED\s*/gi, '').trim() || '100';
  const plannedBudget = `${cleanVal} AED`;
  const actualBudget = `${String(task.actualBudget || '100').replace(/AED\s*/gi, '').trim()} AED`;

  // Counts for attachments & comments
  const commentsCount = task.commentsCount || (task.assignees ? task.assignees.length * 2 + 1 : 3);
  const attachmentsCount = task.attachmentsCount || (task._id ? (task._id.length % 4) + 1 : 2);

  return {
    ...task,
    priority,
    propertyContext,
    typeBadge,
    progressPct,
    plannedBudget,
    actualBudget,
    commentsCount,
    attachmentsCount,
    dueDate: task.actualDate || task.plannedDate || 'Oct 30, 2026',
  };
};

/**
 * Calculate column budget sum formatted as "4.8M AED planned" or "350K AED planned".
 */
export const calculateColumnBudgetSummary = (columnTasks = []) => {
  let totalNum = 0;
  columnTasks.forEach((t) => {
    const bStr = t.plannedBudget || '';
    const num = parseFloat(bStr.replace(/[^0-9.]/g, '')) || 0;
    if (bStr.toUpperCase().includes('K')) {
      totalNum += num * 1000;
    } else if (bStr.toUpperCase().includes('M')) {
      totalNum += num * 1000000;
    } else {
      totalNum += num;
    }
  });

  if (totalNum >= 1000000) {
    return `${(totalNum / 1000000).toFixed(1)}M AED planned`;
  } else if (totalNum >= 1000) {
    return `${(totalNum / 1000).toFixed(0)}K AED planned`;
  }
  return `${totalNum} AED planned`;
};
