import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7221',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We only log if it's NOT the initial info check to avoid terminal noise
    if (error.response?.status === 401 && !error.config.url.includes('/auth/manage/info')) {
      console.warn('Sessão expirada ou não autorizado');
    }
    return Promise.reject(error);
  }
);

export default api;
