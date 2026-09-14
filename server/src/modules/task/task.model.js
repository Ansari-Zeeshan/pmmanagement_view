import mongoose from 'mongoose';

export const TASK_STATUS = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  COMPLETED: 'COMPLETED',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

const taskSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', index: true },
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TO_DO,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
      index: true,
    },
    labels: [{ type: String }],
    startDate: { type: Date },
    dueDate: { type: Date, index: true },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    plannedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    dependencies: [
      {
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        type: { type: String, enum: ['FS', 'SS', 'FF', 'SF'], default: 'FS' },
      },
    ],
    orderIndex: { type: Number, default: 0 },
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

taskSchema.index({ organizationId: 1, projectId: 1, status: 1 });
taskSchema.index({ organizationId: 1, assignees: 1 });
taskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model('Task', taskSchema);
