import { create } from 'zustand';
import { addNotificationToDatabase, getSavedNotifications, getSavedTasks, saveNotifications, saveTasks, updateTaskInDatabase } from '../lib/taskDatabase';

export type WorkspaceView = 'LIST' | 'KANBAN' | 'GANTT' | 'CALENDAR' | 'WORKLOAD';

export interface WorkspaceState {
  activeView: WorkspaceView;
  selectedProjectId: string;
  searchQuery: string;
  isNotificationDrawerOpen: boolean;
  isProjectModalOpen: boolean;
  activeTaskDetail: any | null;
  isChatDrawerOpen: boolean;
  isHelpModalOpen: boolean;
  helpModalDefaultTab: string;
  sidebarExpanded: boolean;

  tasks: any[];
  notifications: any[];
  projectChats: Record<string, any[]>;

  setActiveView: (view: WorkspaceView) => void;
  setSelectedProjectId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setNotificationDrawerOpen: (isOpen: boolean) => void;
  setProjectModalOpen: (isOpen: boolean) => void;
  setActiveTaskDetail: (task: any) => void;
  setChatDrawerOpen: (isOpen: boolean) => void;
  setHelpModalOpen: (isOpen: boolean, tab?: string) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;

  setTasks: (tasks: any[]) => void;
  updateTask: (updatedTask: any) => void;
  addProject: (newProject: any) => void;

  addNotification: (notif: any) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  addChatMessage: (taskId: string, messageObj: any) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeView: 'LIST',
  selectedProjectId: 'all',
  searchQuery: '',
  isNotificationDrawerOpen: false,
  isProjectModalOpen: false,
  activeTaskDetail: null,
  isChatDrawerOpen: false,
  isHelpModalOpen: false,
  helpModalDefaultTab: 'VIDEOS',
  sidebarExpanded: false,

  tasks: getSavedTasks(),
  notifications: getSavedNotifications(),
  projectChats: {
    'task-1': [
      { id: 'c1', sender: 'Claire Bure', text: 'Feasibility analysis document has been uploaded for executive review.', timestamp: '10:30 AM', avatar: '/img/client1.jpg' },
      { id: 'c2', sender: 'John Doe', text: 'Great work! Steering committee will sign off tomorrow.', timestamp: '11:15 AM', avatar: '/img/client1.jpg' },
    ],
    'task-5': [
      { id: 'c3', sender: 'Ajmal Khan', text: 'Kanban drag-and-drop state store is now connected with backend sync.', timestamp: '02:45 PM', avatar: '/img/client2.jpg' },
    ]
  },

  setActiveView: (activeView) => set({ activeView }),
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setNotificationDrawerOpen: (isOpen) => set({ isNotificationDrawerOpen: isOpen }),
  setProjectModalOpen: (isOpen) => set({ isProjectModalOpen: isOpen }),
  setActiveTaskDetail: (task) => set({ activeTaskDetail: task }),
  setChatDrawerOpen: (isOpen) => set({ isChatDrawerOpen: isOpen }),
  setHelpModalOpen: (isOpen, tab = 'VIDEOS') => set({ isHelpModalOpen: isOpen, helpModalDefaultTab: tab }),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  setTasks: (tasks) => {
    saveTasks(tasks);
    set({ tasks });
  },

  updateTask: (updatedTask) => {
    const currentTasks = get().tasks;
    const newTasks = updateTaskInDatabase(updatedTask, currentTasks);
    set({ tasks: newTasks });

    const activeDetail = get().activeTaskDetail;
    if (activeDetail && activeDetail._id === updatedTask._id) {
      set({ activeTaskDetail: { ...activeDetail, ...updatedTask } });
    }
  },

  addProject: (newProject) => {
    const currentTasks = get().tasks;
    const updatedTasks = [newProject, ...currentTasks];
    saveTasks(updatedTasks);
    set({ tasks: updatedTasks });

    const notif = {
      id: 'notif-' + Date.now(),
      title: 'New Project Added',
      message: `Project ${newProject.reference || ''} '${newProject.title}' was added to ${newProject.group || 'Research'} group.`,
      time: 'Just now',
      type: 'success',
      read: false,
      projectRef: newProject.reference || 'PRJ-NEW',
    };
    get().addNotification(notif);
  },

  addNotification: (notif) => {
    const updatedNotifs = addNotificationToDatabase(notif);
    set({ notifications: updatedNotifs });
  },

  markNotificationRead: (notifId) => {
    const current = get().notifications;
    const updated = current.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    saveNotifications(updated);
    set({ notifications: updated });
  },

  markAllNotificationsRead: () => {
    const current = get().notifications;
    const updated = current.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    set({ notifications: updated });
  },

  addChatMessage: (taskId, messageObj) => {
    set((state) => {
      const currentChats = state.projectChats[taskId] || [];
      return {
        projectChats: {
          ...state.projectChats,
          [taskId]: [...currentChats, messageObj],
        },
      };
    });
  },
}));
