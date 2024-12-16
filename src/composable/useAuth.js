// src/composables/useAuth.js
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useRouter } from 'vue-router';

const useAuth = () => {
  const authStore = useAuthStore();
  const cookies = new Cookies();
  const router = useRouter();
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const logout = async () => {
    try {
      const token = cookies.get('auth_token');
      await axios.post(`${apiUrl}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      authStore.clearAuthData();
      console.log('Logout successful');
      router.push('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    logout,
  };
};

export default useAuth;
