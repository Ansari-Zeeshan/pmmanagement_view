import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    type: { type: String, enum: ['DIRECT', 'PROJECT', 'GROUP'], required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    name: { type: String }, // For group or project chat
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: {
      content: String,
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date,
    },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileMetadata' }],
    replyToId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Message = mongoose.model('Message', messageSchema);
