import { defineStore } from 'pinia';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: cookies.get('auth_token') || null,
    role: cookies.get('role') || null,
    profile: null, // Add profile to state
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
    async fetchProfile() {
      try {
        // Use the existing cookies instance
        const token = cookies.get("auth_token");
        
        if (!token) return;
        
        // Make sure to use the same env variable name as in your login/signup
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        console.log("Fetching profile from:", `${apiUrl}/profile`);
        
        const response = await fetch(`${apiUrl}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Check response type before parsing
        const contentType = response.headers.get('content-type');
        console.log("Response content type:", contentType);
        
        if (!response.ok) {
          console.error("Error status:", response.status);
          // For debugging, show response text instead of trying to parse JSON
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        this.profile = data.data;
        console.log("Profile fetched successfully");
      } catch (error) {
        console.error("Profile fetch failed:", error);
        this.profile = null; // Reset profile on error
      }
    }
  },
});
