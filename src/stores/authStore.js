import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Load from localStorage on init
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    token.value = storedToken;
    user.value = JSON.parse(storedUser);
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const register = async (userData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.register(userData);

      user.value = response.data.user;
      token.value = response.data.token;

      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.error || 'Registration failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.login(credentials);

      user.value = response.data.user;
      token.value = response.data.token;

      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshProfile = async () => {
    try {
      const response = await api.getProfile();
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    refreshProfile
  };
});
