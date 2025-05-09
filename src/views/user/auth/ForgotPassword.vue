<template>
  <div class="flex justify-center items-center min-h-screen px-4 py-12">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
      <div class="text-center mb-6">
        <div class="inline-flex justify-center items-center mb-3 w-12 h-12 rounded-full bg-blue-100">
          <i class="fas fa-lock text-blue-600 text-xl"></i>
          </div>
        <h2 class="text-2xl font-bold text-gray-800">Forgot Password</h2>
        <p class="text-gray-600 text-sm mt-2">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      <form @submit.prevent="sendResetLink" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
            placeholder="your@email.com" 
            :disabled="isLoading"
          />
        </div>

        <button 
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>
  
      <div v-if="message" class="mt-6 p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-start">
        <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>{{ message }}</span>
      </div>
      
      <div v-if="error" class="mt-6 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start">
        <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>{{ error }}</span>
      </div>

      <div class="text-center mt-6">
        <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-800 transition">
          Back to Login
        </router-link>
      </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const email = ref("");
  const message = ref("");
  const error = ref("");
const isLoading = ref(false);
  
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  
  const sendResetLink = async () => {
  isLoading.value = true;
  message.value = "";
  error.value = "";
  
    try {
      const response = await axios.post(`${apiUrl}/forgot-password`, null, {
        params: { email: email.value },
      });
    message.value = "Reset link sent! Please check your email inbox.";
    } catch (err) {
      console.error(err);
    error.value = err.response?.data?.message || "Failed to send reset link. Please try again.";
  } finally {
    isLoading.value = false;
    }
  };
  </script>
  