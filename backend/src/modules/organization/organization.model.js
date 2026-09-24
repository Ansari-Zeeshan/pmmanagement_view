import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    logoUrl: { type: String },
    subscriptionPlan: {
      type: String,
      enum: ['FREE', 'PRO', 'ENTERPRISE'],
      default: 'ENTERPRISE',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', organizationSchema);
