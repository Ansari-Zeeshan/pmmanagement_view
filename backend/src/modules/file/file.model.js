import mongoose from 'mongoose';

const fileMetadataSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', index: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true }, // Bytes
    storageKey: { type: String, required: true },
    url: { type: String, required: true },
    version: { type: Number, default: 1 },
    isFinalVersion: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

fileMetadataSchema.index({ organizationId: 1, projectId: 1 });
fileMetadataSchema.index({ organizationId: 1, taskId: 1 });

export const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);
