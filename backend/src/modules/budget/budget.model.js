import mongoose from 'mongoose';

export const BUDGET_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
};

const budgetTransactionSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    category: {
      type: String,
      enum: ['EQUIPMENT', 'LABOR', 'CONTRACTOR', 'PERMITS', 'MISC'],
      default: 'MISC',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'AED' },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BUDGET_STATUS),
      default: BUDGET_STATUS.PENDING,
      index: true,
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FileMetadata' },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

budgetTransactionSchema.index({ organizationId: 1, projectId: 1, status: 1 });

export const BudgetTransaction = mongoose.model('BudgetTransaction', budgetTransactionSchema);
