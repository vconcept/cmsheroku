import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.login(email, password);
      set({ user, isAuthenticated: true, loading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        loading: false 
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(data);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        loading: false 
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.updateProfile(data);
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Update failed',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
