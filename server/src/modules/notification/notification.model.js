import mongoose from 'mongoose';

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  MENTION: 'MENTION',
  MESSAGE: 'MESSAGE',
  PROJECT_UPDATED: 'PROJECT_UPDATED',
  PROJECT_INVITATION: 'PROJECT_INVITATION',
  BUDGET_REQUEST: 'BUDGET_REQUEST',
  BUDGET_APPROVED: 'BUDGET_APPROVED',
  BUDGET_REJECTED: 'BUDGET_REJECTED',
  DEADLINE_APPROACHING: 'DEADLINE_APPROACHING',
  COMMENT: 'COMMENT',
  FILE_UPLOADED: 'FILE_UPLOADED',
  REQUEST_CREATED: 'REQUEST_CREATED',
  REQUEST_APPROVED: 'REQUEST_APPROVED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
};

const notificationSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    entityType: {
      type: String,
      enum: ['PROJECT', 'TASK', 'BUDGET', 'CHAT', 'REQUEST', 'FILE', 'SYSTEM'],
      default: 'SYSTEM',
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
