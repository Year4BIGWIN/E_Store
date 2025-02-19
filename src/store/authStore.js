import { defineStore } from 'pinia';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: cookies.get('auth_token') || null,
    role: cookies.get('role') || null,
  }),
  actions: {
    setAuthData(token, role) {
      this.token = token;
      this.role = role;

      // Set cookies
      cookies.set('auth_token', token, { secure: true, sameSite: 'strict' });
      cookies.set('role', role, { secure: true, sameSite: 'strict' });
    },
    clearAuthData() {
      this.token = null;
      this.role = null;

      // Remove cookies
      cookies.remove('auth_token');
      cookies.remove('role');
    },
  },
});
