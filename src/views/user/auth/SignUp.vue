<template>
  <div
    class="w-[1024px] mt-10 bg-[#d9d9d9] rounded-xl flex items-center justify-between"
  >
    <div class="w-1/2 flex justify-center p-10">
      <img src="/src/assets/image/loin.svg" alt="..." />
    </div>
    <div
      class="w-1/2 p-10 bg-[#f5f5f5] flex flex-col justify-center items-center rounded-xl"
    >
      <h1 class="font-bold text-2xl mb-5">Sign Up</h1>
      <form class="max-w-sm" @submit.prevent="signup">
        <div class="mb-5 flex justify-between">
          <div>
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
          <div>
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
              placeholder="John"
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
            placeholder="name@flowbite.com"
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
            type="password"
            id="password"
            v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Comfirm Password</label
          >
          <input
            type="password"
            v-model="confirmPassword"
            id="comfirm-password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-[384px] px-5 py-2.5 text-center"
        >
          SignUp
        </button>
      </form>
      <div class="mt-5">
        Already have an account? <router-link class="hover:text-blue-500" to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
import router from '@/router';
// use universal cookies to store user data
import Cookies from 'universal-cookie';

const cookies = new Cookies();
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
    const response = await axios.post(`${apiUrl}/signup`, {
      email: email.value, // Capture the current email input
      password: password.value, // Capture the current password input
      first_name: firstName.value,
      last_name: lastName.value,
    });
    const token = response.data.token; // Adjust this line based on your API response structure
    cookies.set('auth_token', token, { secure: true, sameSite: 'strict' });
    console.log('Token stored in cookies:', token);
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