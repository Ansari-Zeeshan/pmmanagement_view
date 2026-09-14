import { create } from 'zustand';

export const useWorkspaceStore = create((set) => ({
  activeView: 'LIST', // 'LIST' | 'KANBAN' | 'GANTT' | 'CALENDAR' | 'WORKLOAD'
  selectedProjectId: 'all',
  searchQuery: '',
  isNotificationDrawerOpen: false,
  isProjectModalOpen: false,
  activeTaskDetail: null,
  isChatDrawerOpen: false,

  setActiveView: (activeView) => set({ activeView }),
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setNotificationDrawerOpen: (isOpen) => set({ isNotificationDrawerOpen: isOpen }),
  setProjectModalOpen: (isOpen) => set({ isProjectModalOpen: isOpen }),
  setActiveTaskDetail: (task) => set({ activeTaskDetail: task }),
  setChatDrawerOpen: (isOpen) => set({ isChatDrawerOpen: isOpen }),
}));
