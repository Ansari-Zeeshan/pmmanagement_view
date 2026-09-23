import { create } from 'zustand';

export const useWorkspaceStore = create((set) => ({
  activeView: 'LIST', // 'LIST' | 'KANBAN' | 'GANTT' | 'CALENDAR' | 'WORKLOAD'
  selectedProjectId: 'all',
  searchQuery: '',
  isNotificationDrawerOpen: false,
  isProjectModalOpen: false,
  activeTaskDetail: null,
  isChatDrawerOpen: false,
  isHelpModalOpen: false,
  helpModalDefaultTab: 'VIDEOS',
  sidebarExpanded: false, // Default collapsed state

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
}));
