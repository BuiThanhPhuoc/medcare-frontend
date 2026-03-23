import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔍 [API Request] Token:', token ? '✅ Present' : '❌ Missing', 'URL:', config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('❌ [API Request Error]', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔐 [401 Unauthorized] Token expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      const msg = error.response.data?.message || '';
      const detail = error.response.data?.chi_tiet_loi || '';
      const isJwtError = /token|jwt|hết hạn|expired|invalid signature/i.test(msg + ' ' + detail);

      console.error('🚫 [403 Forbidden]', msg || 'Permission denied');

      if (isJwtError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

