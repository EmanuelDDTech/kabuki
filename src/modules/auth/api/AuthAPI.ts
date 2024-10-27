import api from '@/lib/axios';
import type { createUser, Login } from '../interfaces';
import type {} from '../interfaces/login.interface';

export default {
  async register(data: createUser) {
    return await api.post('/auth/registrar', data);
  },
  async verifyAccount(token: string) {
    return await api.get(`/auth/verificar/${token}`);
  },
  async login(data: Login) {
    return await api.post('/auth/login', data);
  },
  async auth() {
    const token = localStorage.getItem('AUTH_TOKEN');

    return await api.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  async isAdmin() {
    const token = localStorage.getItem('AUTH_TOKEN');

    return await api.get('/auth/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
