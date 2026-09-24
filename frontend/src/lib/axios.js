import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Firebase / Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || 'dev-demo-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for API Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errRes = error.response?.data;
    const message = errRes?.error?.message || errRes?.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);
