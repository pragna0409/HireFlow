import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hireflow_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

let isRedirecting = false;

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';

    if (status === 401) {
      if (!isRedirecting && typeof window !== 'undefined') {
        const path = window.location.pathname;
        localStorage.removeItem('hireflow_token');
        localStorage.removeItem('hireflow_user');
        if (!['/login', '/register', '/'].includes(path)) {
          isRedirecting = true;
          toast.error('Session expired. Please sign in again.');
          setTimeout(() => {
            window.location.href = '/login';
            isRedirecting = false;
          }, 300);
        }
      }
    } else if (status >= 500) {
      toast.error('Server error — please try again later.');
    } else if (status === 403) {
      toast.error(message || 'You do not have permission to do that.');
    }

    return Promise.reject({ ...error, message });
  },
);

export default api;
