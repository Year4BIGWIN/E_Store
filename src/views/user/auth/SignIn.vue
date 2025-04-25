<template>
  <div
    class="w-[1024px] bg-[#d9d9d9] rounded-xl flex items-center justify-between mt-10 mb-10"
  >
    <!-- Left Image Section -->
    <div class="w-1/2 flex justify-center p-10">
      <img src="/src/assets/image/loin.svg" alt="..." />
    </div>
    <!-- Right Login Form Section -->
    <div
      class="w-1/2 p-10 bg-[#f5f5f5] flex flex-col justify-center items-center rounded-xl"
    >
      <h1 class="font-bold text-2xl mb-5">Login</h1>
      <form class="max-w-sm" @submit.prevent="login">
        <!-- Email Input -->
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="relative mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="********"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <button
            type="button"
            class="absolute top-10 right-3 flex items-center text-gray-500"
            @click="togglePassword"
          >
            <i
              :class="
                showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
              "
            ></i>
          </button>
        </div>

        <!-- Forget Password -->
        <div class="flex justify-end mb-5">
          <router-link class="hover:text-blue-500" to="/login"
            >Forget Password?</router-link
          >
        </div>

        <!-- Login Button -->
        <button
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-[384px] px-5 py-2.5 text-center"
        >
          Login
        </button>
      </form>

      <!-- Sign Up -->
      <div class="my-5">
        Don't have an account?
        <router-link class="hover:text-blue-500" to="/signup"
          >SignUp</router-link
        >
      </div>

      <!-- Divider -->
      <div class="w-[384px] mb-5 flex justify-center items-center">
        <hr class="w-[125px] border-gray-300" />
        <h1>Or Sign in with</h1>
        <hr class="w-[125px] border-gray-300" />
      </div>

      <!-- Google Sign-in -->
      <router-link class="hover:text-blue-500" to="/signup">
        <i class="fa-brands fa-google fa-2x"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email: email.value,
      password: password.value,
    });

    const token = response.data.data.token;
    const role = response.data.data.role;

    // Update Pinia store
    authStore.setAuthData(token, role);
    console.log("Token and role updated in store");
    
    // Fetch profile after successful login
    await authStore.fetchProfile();
    
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data : error);
  }
};

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>