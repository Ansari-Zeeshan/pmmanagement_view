import mongoose from 'mongoose';

export const PROJECT_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const PROJECT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

const projectSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    clientName: { type: String, default: 'Emaar Properties' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domainLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.PLANNED,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(PROJECT_PRIORITY),
      default: PROJECT_PRIORITY.MEDIUM,
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    plannedBudget: { type: Number, default: 0 },
    actualBudget: { type: Number, default: 0 },
    currency: { type: String, default: 'AED' },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    tags: [{ type: String }],
    customFields: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    isArchived: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

projectSchema.index({ organizationId: 1, status: 1 });
projectSchema.index({ organizationId: 1, isArchived: 1 });
projectSchema.index({ name: 'text', description: 'text', clientName: 'text' });

export const Project = mongoose.model('Project', projectSchema);
