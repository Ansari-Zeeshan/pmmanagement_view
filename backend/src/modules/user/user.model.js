import mongoose from 'mongoose';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  TEAM_LEAD: 'TEAM_LEAD',
  EMPLOYEE: 'EMPLOYEE',
  FINANCE: 'FINANCE',
  VIEWER: 'VIEWER',
};

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: 'icons/avatar1.svg' },
    department: { type: String, default: 'Engineering' },
    title: { type: String, default: 'Senior Specialist' },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EMPLOYEE,
      required: true,
    },
    capacityHoursPerWeek: { type: Number, default: 40 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ organizationId: 1, email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
