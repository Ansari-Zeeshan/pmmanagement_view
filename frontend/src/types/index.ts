export type UserRole =
  | 'Super Admin'
  | 'Project Owner'
  | 'Domain Lead'
  | 'Department Lead'
  | 'Steering Committee'
  | 'IT Security Lead'
  | 'Finance Lead'
  | 'Team Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  phone?: string;
  designation?: string;
}

export type ProjectStatus =
  | 'Approved'
  | 'In Progress'
  | 'Under Review'
  | 'On Hold'
  | 'Completed'
  | 'Rejected'
  | 'Draft'
  | 'At Risk';

export type ProjectType =
  | 'Research'
  | 'Wireframe'
  | 'Visual Studio'
  | 'Development'
  | 'Infrastructure';

export interface TaskItem {
  id: string;
  milestoneId: string;
  title: string;
  assignee: string;
  assigneeRole?: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Blocked' | 'Review';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  hoursEstimated?: number;
  hoursSpent?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  dueDate: string;
  startDate?: string;
  progressPercent: number;
  status: ProjectStatus;
  totalTasks: number;
  tasksCompleted: number;
  tasks?: TaskItem[];
}

export interface Project {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  type: ProjectType;
  category?: string;
  status: ProjectStatus;
  progressPercent: number;
  budget: number;
  spentBudget?: number;
  startDate: string;
  targetCompletionDate: string;
  projectOwner: string;
  domainLead: string;
  department: string;
  milestonesCount?: number;
  completedMilestonesCount?: number;
  milestones?: Milestone[];
  tasks?: TaskItem[];
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  sponsor?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
  link?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export interface Approver {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Delegated';
  comments?: string;
  approvedAt?: string;
}

export interface CalendarWorkOrder {
  id: string;
  projectId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  assignee: string;
  status: string;
  category: string;
  description?: string;
}
