import mongoose from 'mongoose';

const savedViewSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewType: { type: String, enum: ['LIST', 'KANBAN', 'GANTT', 'CALENDAR', 'WORKLOAD'], default: 'LIST' },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} },
    sorting: [{ field: String, order: { type: String, enum: ['asc', 'desc'], default: 'asc' } }],
    grouping: { type: String },
    columns: [{ type: String }],
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SavedView = mongoose.model('SavedView', savedViewSchema);
