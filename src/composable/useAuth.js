// src/composables/useAuth.js
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useRouter } from 'vue-router';

const useAuth = () => {
  const cartStore = useCartStore();
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
      cartStore.$reset(); // Reset cart to initial state
      console.log('Logout successful');
      router.push('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getToken = () => {
    const token = cookies.get("auth_token");
    return token && token.split(".").length === 3 ? token : null;
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : null;
  };

  return {
    logout,
    getToken,
    getAuthHeaders
  };
};

export default useAuth;
