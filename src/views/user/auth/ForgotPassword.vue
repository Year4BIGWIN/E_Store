<template>
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-10 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6">Forgot Password</h2>
        <form @submit.prevent="sendResetLink">
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input v-model="email" type="email" required
              class="w-full mt-2 p-2 border border-gray-300 rounded-lg" placeholder="Enter your email" />
          </div>
          <button type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Send Reset Link
          </button>
        </form>
  
        <div v-if="message" class="mt-4 text-green-600">{{ message }}</div>
        <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const email = ref("");
  const message = ref("");
  const error = ref("");
  
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  
  const sendResetLink = async () => {
    try {
      const response = await axios.post(`${apiUrl}/forgot-password`, null, {
        params: { email: email.value },
      });
      message.value = "Please check your email for the reset link.";
      error.value = "";
    } catch (err) {
      console.error(err);
      error.value = "Failed to send reset link.";
      message.value = "";
    }
  };
  </script>
  