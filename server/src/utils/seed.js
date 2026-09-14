import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Organization } from '../modules/organization/organization.model.js';
import { User, ROLES } from '../modules/user/user.model.js';
import { Project, PROJECT_STATUS, PROJECT_PRIORITY } from '../modules/project/project.model.js';
import { Task, TASK_STATUS, TASK_PRIORITY } from '../modules/task/task.model.js';
import { Milestone } from '../modules/milestone/milestone.model.js';
import { BudgetTransaction } from '../modules/budget/budget.model.js';
import { Notification } from '../modules/notification/notification.model.js';
import logger from './logger.js';

export const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Seeding database with Emaar enterprise mock data...');

    // Clear existing
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Milestone.deleteMany({});
    await BudgetTransaction.deleteMany({});
    await Notification.deleteMany({});

    // 1. Create Organization
    const org = await Organization.create({
      name: 'Emaar Properties PJSC',
      code: 'EMAAR',
      subscriptionPlan: 'ENTERPRISE',
    });

    // 2. Create Users
    const adminUser = await User.create({
      firebaseUid: 'dev-demo-uid-1',
      organizationId: org._id,
      email: 'admin@emaar.ae',
      name: 'Emaar Admin',
      avatarUrl: 'icons/avatar1.svg',
      department: 'Executive Board',
      title: 'Senior Vice President',
      role: ROLES.ORG_ADMIN,
    });

    const pmUser = await User.create({
      firebaseUid: 'dev-demo-uid-2',
      organizationId: org._id,
      email: 'john.doe@emaar.ae',
      name: 'John Doe',
      avatarUrl: 'icons/avatar1.svg',
      department: 'Project Management',
      title: 'Principal Project Manager',
      role: ROLES.PROJECT_MANAGER,
    });

    const leadUser = await User.create({
      firebaseUid: 'dev-demo-uid-3',
      organizationId: org._id,
      email: 'sarah.smith@emaar.ae',
      name: 'Sarah Smith',
      avatarUrl: 'icons/avatr4.svg',
      department: 'Civil Engineering',
      title: 'Domain Lead',
      role: ROLES.TEAM_LEAD,
    });

    const employeeUser = await User.create({
      firebaseUid: 'dev-demo-uid-4',
      organizationId: org._id,
      email: 'ali.khan@emaar.ae',
      name: 'Ali Khan',
      avatarUrl: 'icons/avtar6.svg',
      department: 'Architecture & Design',
      title: 'Senior Architect',
      role: ROLES.EMPLOYEE,
    });

    // 3. Create Projects
    const project1 = await Project.create({
      organizationId: org._id,
      code: 'EMAAR-BEACHFRONT',
      name: 'Emaar Beachfront Tower 1',
      description: 'Luxury residential beachfront tower development in Dubai Harbor.',
      clientName: 'Emaar Development',
      ownerId: adminUser._id,
      projectManagerId: pmUser._id,
      domainLeadId: leadUser._id,
      members: [pmUser._id, leadUser._id, employeeUser._id],
      status: PROJECT_STATUS.IN_PROGRESS,
      priority: PROJECT_PRIORITY.HIGH,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-12-30'),
      plannedBudget: 4500000,
      actualBudget: 1200000,
      currency: 'AED',
      progressPercentage: 65,
      tags: ['Beachfront', 'Residential', 'High-Rise'],
      createdBy: adminUser._id,
    });

    const project2 = await Project.create({
      organizationId: org._id,
      code: 'DUBAI-MALL-EXP',
      name: 'Dubai Mall Fashion Avenue Expansion',
      description: 'Phase 3 expansion of luxury retail wings.',
      clientName: 'Emaar Malls',
      ownerId: adminUser._id,
      projectManagerId: pmUser._id,
      domainLeadId: leadUser._id,
      members: [pmUser._id, leadUser._id],
      status: PROJECT_STATUS.PLANNED,
      priority: PROJECT_PRIORITY.MEDIUM,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-02-15'),
      plannedBudget: 8000000,
      actualBudget: 450000,
      currency: 'AED',
      progressPercentage: 20,
      tags: ['Retail', 'Expansion'],
      createdBy: adminUser._id,
    });

    // 4. Create Milestones
    const milestone1 = await Milestone.create({
      organizationId: org._id,
      projectId: project1._id,
      title: 'Substructure & Foundation Signoff',
      dueDate: new Date('2026-05-30'),
      status: 'COMPLETED',
      createdBy: pmUser._id,
    });

    const milestone2 = await Milestone.create({
      organizationId: org._id,
      projectId: project1._id,
      title: 'Structural Framing Level 20',
      dueDate: new Date('2026-09-15'),
      status: 'IN_PROGRESS',
      createdBy: pmUser._id,
    });

    // 5. Create Tasks
    await Task.create([
      {
        organizationId: org._id,
        projectId: project1._id,
        milestoneId: milestone1._id,
        title: 'Architectural Blueprint Signoff',
        description: 'Complete final signoff for floorplans 1-30.',
        assignees: [leadUser._id, employeeUser._id],
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.HIGH,
        labels: ['Architecture', 'Review'],
        startDate: new Date('2026-01-15'),
        dueDate: new Date('2026-02-28'),
        estimatedHours: 120,
        actualHours: 115,
        plannedCost: 50000,
        actualCost: 48000,
        orderIndex: 0,
        createdBy: pmUser._id,
      },
      {
        organizationId: org._id,
        projectId: project1._id,
        milestoneId: milestone2._id,
        title: 'Concrete Pouring Tower Base B2',
        description: 'Sub-grade concrete pour and testing.',
        assignees: [employeeUser._id],
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.URGENT,
        labels: ['Civil', 'Site Work'],
        startDate: new Date('2026-03-01'),
        dueDate: new Date('2026-09-20'),
        estimatedHours: 250,
        actualHours: 180,
        plannedCost: 350000,
        actualCost: 310000,
        orderIndex: 1,
        createdBy: pmUser._id,
      },
      {
        organizationId: org._id,
        projectId: project1._id,
        milestoneId: milestone2._id,
        title: 'MEP Systems Procurement Review',
        description: 'Review contractor bids for HVAC and electrical distribution.',
        assignees: [leadUser._id],
        status: TASK_STATUS.TO_DO,
        priority: TASK_PRIORITY.MEDIUM,
        labels: ['MEP', 'Procurement'],
        startDate: new Date('2026-09-01'),
        dueDate: new Date('2026-10-15'),
        estimatedHours: 80,
        actualHours: 0,
        plannedCost: 150000,
        actualCost: 0,
        orderIndex: 2,
        createdBy: pmUser._id,
      },
      {
        organizationId: org._id,
        projectId: project2._id,
        title: 'Environmental Impact Assessment',
        description: 'Dubai Municipality EIA submission and approvals.',
        assignees: [pmUser._id],
        status: TASK_STATUS.IN_REVIEW,
        priority: TASK_PRIORITY.HIGH,
        labels: ['Compliance', 'Government'],
        startDate: new Date('2026-04-01'),
        dueDate: new Date('2026-06-30'),
        estimatedHours: 90,
        actualHours: 85,
        plannedCost: 75000,
        actualCost: 70000,
        orderIndex: 0,
        createdBy: pmUser._id,
      },
    ]);

    // 6. Create Budget Transactions
    await BudgetTransaction.create([
      {
        organizationId: org._id,
        projectId: project1._id,
        category: 'CONTRACTOR',
        amount: 350000,
        currency: 'AED',
        description: 'Foundation Works Piling Contractor Milestone 1',
        status: 'APPROVED',
        submittedBy: pmUser._id,
        approvedBy: adminUser._id,
      },
      {
        organizationId: org._id,
        projectId: project1._id,
        category: 'EQUIPMENT',
        amount: 120000,
        currency: 'AED',
        description: 'Tower Crane Lease Quarter 3',
        status: 'PENDING',
        submittedBy: leadUser._id,
      },
    ]);

    // 7. Create Notifications
    await Notification.create([
      {
        organizationId: org._id,
        recipientId: pmUser._id,
        senderId: adminUser._id,
        type: 'PROJECT_UPDATED',
        title: 'Project Status Updated',
        message: 'Emaar Beachfront Tower 1 progress set to 65%.',
        entityType: 'PROJECT',
        entityId: project1._id,
        isRead: false,
      },
      {
        organizationId: org._id,
        recipientId: pmUser._id,
        senderId: leadUser._id,
        type: 'BUDGET_REQUEST',
        title: 'New Budget Request',
        message: 'Sarah Smith submitted a budget request for AED 120,000.',
        entityType: 'BUDGET',
        entityId: project1._id,
        isRead: false,
      },
    ]);

    logger.info('Database successfully seeded with enterprise Emaar project data!');
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

if (process.argv[2] === '--run') {
  seedDatabase();
}
