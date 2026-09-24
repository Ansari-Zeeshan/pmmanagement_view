import { create } from 'zustand';
import { apiClient } from '../lib/axios';

export interface AuthUser {
  _id?: string;
  name?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  contactNumber?: string;
  role?: string;
  department?: string;
  designation?: string;
  segment?: string;
  avatarUrl?: string;
  organizationId?: {
    name: string;
    code: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchCurrentUser: () => Promise<void>;
  setUser: (userData: Partial<AuthUser>) => void;
  updateUserProfile: (updatedFields: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: true,

  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('auth_token');
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      let resData: any = null;
      try {
        const res = await apiClient.get('/auth/me');
        resData = res.data;
      } catch (_err) {
        // Backend offline or dev mode fallback
      }

      const savedUserStr = localStorage.getItem('user_info');
      let savedUser: any = null;
      if (savedUserStr) {
        try {
          savedUser = JSON.parse(savedUserStr);
        } catch (_e) {
          // invalid json
        }
      }

      const email =
        resData?.email ||
        savedUser?.email ||
        localStorage.getItem('logged_in_email') ||
        'admin@emaar.ae';

      const emailUsername = email.split('@')[0];
      const formattedNameFromEmail = emailUsername
        .split(/[._-]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      const displayName =
        resData?.name ||
        savedUser?.displayName ||
        savedUser?.name ||
        formattedNameFromEmail ||
        'Emaar Admin';

      const nameParts = displayName.split(' ');
      const firstName =
        resData?.firstName ||
        savedUser?.firstName ||
        nameParts[0] ||
        'Emaar';
      const lastName =
        resData?.lastName ||
        savedUser?.lastName ||
        (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Admin');

      const fullUserObj: AuthUser = {
        _id: resData?._id || savedUser?._id || 'user-admin-id',
        name: displayName,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone:
          resData?.phone ||
          savedUser?.phone ||
          savedUser?.contactNumber ||
          '+971 4 367 3333',
        contactNumber:
          resData?.contactNumber ||
          resData?.phone ||
          savedUser?.contactNumber ||
          savedUser?.phone ||
          '+971 4 367 3333',
        role: resData?.role || savedUser?.role || 'ORG_ADMIN',
        department:
          resData?.department ||
          savedUser?.department ||
          'Project Management',
        designation:
          resData?.designation ||
          savedUser?.designation ||
          resData?.role ||
          savedUser?.role ||
          'Senior Project Director',
        segment:
          resData?.segment ||
          savedUser?.segment ||
          resData?.organizationId?.name ||
          'Emaar Properties PJSC',
        avatarUrl:
          resData?.avatarUrl ||
          savedUser?.avatarUrl ||
          '/icons/avatar1.svg',
        organizationId: resData?.organizationId || {
          name: 'Emaar Properties PJSC',
          code: 'EMAAR',
        },
      };

      set({
        user: fullUserObj,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (_error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (userData: Partial<AuthUser>) => {
    const currentUser = get().user || {};
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user_info', JSON.stringify(updatedUser));
    set({ user: updatedUser, isAuthenticated: !!updatedUser, isLoading: false });
  },

  updateUserProfile: (updatedFields: Partial<AuthUser>) => {
    const currentUser = get().user || {};
    const newUser = { ...currentUser, ...updatedFields };

    if (updatedFields.firstName !== undefined || updatedFields.lastName !== undefined) {
      const fn =
        updatedFields.firstName !== undefined
          ? updatedFields.firstName
          : currentUser.firstName || '';
      const ln =
        updatedFields.lastName !== undefined
          ? updatedFields.lastName
          : currentUser.lastName || '';
      newUser.name = `${fn} ${ln}`.trim();
      newUser.displayName = newUser.name;
    }

    localStorage.setItem('user_info', JSON.stringify(newUser));
    set({ user: newUser });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('logged_in_email');
    localStorage.removeItem('user_info');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
