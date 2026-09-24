import mongoose from 'mongoose';

export const REQUEST_TYPES = {
  BUDGET: 'BUDGET',
  PROJECT: 'PROJECT',
  PURCHASE: 'PURCHASE',
  RESOURCE: 'RESOURCE',
  ACCESS: 'ACCESS',
  SUPPORT: 'SUPPORT',
};

export const REQUEST_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

const requestWorkflowSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    requestCode: { type: String, required: true }, // e.g. "#REQ-000111222"
    title: { type: String, required: true },
    requestType: { type: String, enum: Object.values(REQUEST_TYPES), required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: Object.values(REQUEST_STATUS), default: REQUEST_STATUS.SUBMITTED, index: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    approvalHistory: [
      {
        approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: String,
        comments: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const RequestWorkflow = mongoose.model('RequestWorkflow', requestWorkflowSchema);
