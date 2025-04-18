<template>
  <div class="w-[1024px] mt-10 bg-[#d9d9d9] rounded-xl flex items-center justify-between">
    <div class="w-1/2 flex justify-center p-10">
      <img src="/src/assets/image/loin.svg" alt="..." />
    </div>
    <div class="w-1/2 p-10 bg-[#f5f5f5] flex flex-col justify-center items-center rounded-xl">
      <h1 class="font-bold text-2xl mb-5">Sign Up</h1>
      <form class="max-w-sm" @submit.prevent="signup">
        <!-- First Name and Last Name Inputs -->
        <div class="mb-5 flex justify-between">
          <div>
            <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900">First Name</label>
            <input type="text" id="first-name" v-model="firstName" placeholder="John" class="input-style" required />
          </div>
          <div>
            <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
            <input type="text" id="last-name" v-model="lastName" placeholder="Doe" class="input-style" required />
          </div>
        </div>

        <!-- Email Input -->
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
          <input type="email" id="email" v-model="email" placeholder="name@flowbite.com" class="input-style" required />
        </div>

        <!-- Password and Confirm Password Inputs -->
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
          <input type="password" id="password" v-model="password" class="input-style" required />
        </div>
        <div class="mb-5">
          <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" class="input-style" required />
        </div>

        <!-- Sign Up Button -->
        <button type="submit" class="submit-btn">Sign Up</button>
      </form>

      <div class="mt-5">
        Already have an account? <router-link class="hover:text-blue-500" to="/login">Login</router-link>
      </div>

      <!-- Divider -->
      <div class="my-5 flex justify-center items-center w-[384px]">
        <hr class="divider" />
        <span>Or sign up with</span>
        <hr class="divider" />
      </div>

      <!-- Google Sign-Up Button -->
      <div id="googleSignupButton"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import router from '@/router';
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const passwordError = ref('');

// Sign up with email and password
const signup = async () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match';
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/auth/signup`, {
      email: email.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
    });

    const token = response.data.data.token;
    const role = response.data.data.role;

    authStore.setAuthData(token, role);

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

// Initialize Google Sign-Up
const initGoogleSignup = () => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignup,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignupButton"),
      { theme: "outline", size: "large" }
    );
  } else {
    console.error("Google API not loaded");
  }
};

// Handle Google Sign-Up Token Response
const handleGoogleSignup = async (response) => {
  try {
    const token = response.credential;
    const apiResponse = await axios.post(`${apiUrl}/google-signup`, { token });

    const { token: googleToken, role } = apiResponse.data.data;
    authStore.setAuthData(googleToken, role);

    router.push('/');
  } catch (error) {
    console.error("Google sign-up error:", error.response ? error.response.data : error);
  }
};

// Initialize Google Sign-In
onMounted(() => {
  initGoogleSignup();
});
</script>

<style scoped>
.input-style {
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
}

.divider {
  width: 125px;
  border-color: #ccc;
}
</style>
