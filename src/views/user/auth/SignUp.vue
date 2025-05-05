<template>
  <div
    class="w-[100vw] max-w-[1024px] mx-auto mt-6 mb-6 md:mt-10 md:mb-10 bg-[#d9d9d9] rounded-xl flex flex-col md:flex-row items-center justify-between"
  >
    <!-- Image side - hidden on mobile, visible on md screens and up -->
    <div class="hidden md:block md:w-1/2 justify-center p-10">
      <img src="/src/assets/image/loin.svg" alt="..." />
    </div>
    <!-- Form side - full width on mobile, half width on md screens and up -->
    <div
      class="w-full md:w-1/2 p-6 md:py-8 md:p-5 bg-[#f5f5f5] flex flex-col justify-center items-center rounded-xl"
    >
      <h1 class="font-bold text-2xl mb-5">Sign Up</h1>
      <form class="w-full max-w-sm px-4 md:px-0" @submit.prevent="signup">
        <div class="mb-5 flex flex-col md:flex-row md:justify-between md:gap-4">
          <div class="w-full mb-4 md:mb-0">
            <label
              for="first-name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >First Name</label
            >
            <input
              type="text"
              id="first-name"
              v-model="firstName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="John"
              required
            />
          </div>
          <div class="w-full">
            <label
              for="last-name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Last Name</label
            >
            <input
              type="text"
              id="last-name"
              v-model="lastName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="email"
            v-model="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@example.com"
            required
          />
        </div>

        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Password</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div class="mb-5">
          <label
            for="confirm-password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Confirm Password</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            id="confirm-password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <div v-if="passwordError" class="mt-1 text-red-500 text-sm">{{ passwordError }}</div>
        </div>

        <div class="mb-4 flex items-center">
          <input 
            id="show-password" 
            type="checkbox" 
            v-model="showPassword" 
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="show-password" class="ms-2 text-sm font-medium text-gray-900">Show password</label>
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-3 text-center"
        >
          Sign Up
        </button>
      </form>
      <div class="mt-5 text-center">
        Already have an account? <router-link class="text-blue-700 hover:text-blue-500" to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
import router from '@/router';
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;
console.log(apiUrl);

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const passwordError = ref('');

const signup = async () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match';
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/auth/signup`, {
      email: email.value, // Capture the current email input
      password: password.value, // Capture the current password input
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



const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

</script>