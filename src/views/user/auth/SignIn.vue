<template>
  <div class="w-[1024px] mt-10 bg-[#d9d9d9] rounded-xl flex items-center justify-between">
    <div class="w-1/2 flex justify-center p-10">
      <img src="/src/assets/image/loin.svg" alt="..." />
    </div>
    <div class="w-1/2 p-10 bg-[#f5f5f5] flex flex-col justify-center items-center rounded-xl">
      <h1 class="font-bold text-2xl mb-5">Sign In</h1>
      <form class="max-w-sm" @submit.prevent="signin">
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required
          />
        </div>

        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-[384px] px-5 py-2.5 text-center"
        >
          Sign In
        </button>
      </form>

      <div class="mt-5">
        Don't have an account? <router-link class="hover:text-blue-500" to="/signup">Sign Up</router-link>
      </div>

      <div class="w-[384px] mb-5 flex justify-center items-center mt-5">
        <hr class="w-[125px] border-gray-300" />
        <h1>Or Sign in with</h1>
        <hr class="w-[125px] border-gray-300" />
      </div>

      <div id="googleSigninButton"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const email = ref('');
const password = ref('');

// Sign in with email and password
const signin = async () => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email: email.value,
      password: password.value,
    });

    const { token, role } = response.data.data;
    authStore.setAuthData(token, role);
    localStorage.setItem("jwtToken", token);
    router.push("/");
  } catch (error) {
    console.error("Sign-in error:", error.response ? error.response.data : error);
  }
};

// Initialize Google Sign-In
const initGoogleSignin = () => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("googleSigninButton"),
      { theme: "outline", size: "large" }
    );
  } else {
    console.error("Google API not loaded");
  }
};

// Handle Google Token Response for Sign-In
const handleGoogleSignin = async (response) => {
  try {
    const token = response.credential;
    const apiResponse = await axios.post(`${apiUrl}/google-signup`, { token });

    if (apiResponse.data.status === "200") {
      const { token, role } = apiResponse.data.data;
      authStore.setAuthData(token, role);
      localStorage.setItem("jwtToken", token);
      router.push("/");
    } else {
      console.error("Google sign-in failed:", apiResponse.data.message);
    }
  } catch (error) {
    console.error("Google sign-in error:", error.response ? error.response.data : error);
  }
};

// Initialize Google API on mount
onMounted(() => {
  initGoogleSignin();
});
</script>
