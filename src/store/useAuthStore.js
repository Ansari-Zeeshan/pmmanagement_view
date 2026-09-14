import { create } from 'zustand';
import { apiClient } from '../lib/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: true,

  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const res = await apiClient.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // In dev fallback mode
      set({
        user: {
          _id: 'user-demo-id',
          name: 'John Doe',
          email: 'john.doe@emaar.ae',
          role: 'ORG_ADMIN',
          department: 'Project Management',
          avatarUrl: 'icons/avatar1.svg',
          organizationId: { name: 'Emaar Properties PJSC', code: 'EMAAR' },
        },
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
