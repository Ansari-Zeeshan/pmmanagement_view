import { BudgetTransaction } from './budget.model.js';
import { Project } from '../project/project.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getProjectBudgetSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({ _id: projectId, organizationId: req.organizationId });
    if (!project) {
      return ApiResponse.error(res, 'PROJECT_NOT_FOUND', 'Project not found.', 404);
    }

    const transactions = await BudgetTransaction.find({
      projectId,
      organizationId: req.organizationId,
    })
      .populate('submittedBy', 'name email avatarUrl')
      .populate('approvedBy', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    const totalApprovedSpending = transactions
      .filter((t) => t.status === 'APPROVED' || t.status === 'PAID')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPendingRequests = transactions
      .filter((t) => t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0);

    return ApiResponse.success(
      res,
      {
        projectId: project._id,
        plannedBudget: project.plannedBudget,
        actualSpending: totalApprovedSpending,
        pendingRequests: totalPendingRequests,
        remainingBudget: project.plannedBudget - totalApprovedSpending,
        currency: project.currency,
        transactions,
      },
      'Budget summary calculated successfully.'
    );
  } catch (error) {
    return ApiResponse.error(res, 'BUDGET_CALC_ERROR', error.message, 500);
  }
};

export const createBudgetTransaction = async (req, res) => {
  try {
    const { projectId, category, amount, currency, description } = req.body;

    const transaction = await BudgetTransaction.create({
      organizationId: req.organizationId,
      projectId,
      category: category || 'MISC',
      amount: Number(amount),
      currency: currency || 'AED',
      description,
      status: 'PENDING',
      submittedBy: req.user._id,
    });

    return ApiResponse.success(res, transaction, 'Budget request submitted successfully.', 201);
  } catch (error) {
    return ApiResponse.error(res, 'BUDGET_SUBMIT_ERROR', error.message, 500);
  }
};

export const approveBudgetTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body; // APPROVED or REJECTED

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return ApiResponse.error(res, 'INVALID_STATUS', 'Status must be APPROVED or REJECTED.', 400);
    }

    const transaction = await BudgetTransaction.findOneAndUpdate(
      { _id: id, organizationId: req.organizationId },
      { $set: { status, approvedBy: req.user._id } },
      { new: true }
    );

    if (!transaction) {
      return ApiResponse.error(res, 'TRANSACTION_NOT_FOUND', 'Transaction not found.', 404);
    }

    // Update actualBudget on Project if APPROVED
    if (status === 'APPROVED') {
      await Project.findByIdAndUpdate(transaction.projectId, {
        $inc: { actualBudget: transaction.amount },
      });
    }

    return ApiResponse.success(res, transaction, `Budget request ${status.toLowerCase()} successfully.`);
  } catch (error) {
    return ApiResponse.error(res, 'BUDGET_APPROVE_ERROR', error.message, 500);
  }
};
