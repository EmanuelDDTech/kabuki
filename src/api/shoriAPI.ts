import axios from 'axios';

const shoriAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

shoriAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('AUTH_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { shoriAPI };
