<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden w-screen"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"
      ></div>
    </div>

    <div class="w-full max-w-lg relative z-10">
      <!-- Glassmorphism Card -->
      <div
        class="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-300 hover:shadow-3xl"
      >
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div
            class="inline-flex justify-center items-center mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transform transition-transform hover:scale-110 duration-300"
          >
            <i class="fas fa-envelope text-white text-2xl"></i>
          </div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
          >
            Forgot Password?
          </h1>
          <p class="text-gray-600 text-sm">
            No worries! Enter your email and we'll send you reset instructions
          </p>
        </div>

        <form @submit.prevent="sendResetLink" class="space-y-6">
          <!-- Email Input Field -->
          <div class="space-y-2">
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-envelope text-gray-400 group-focus-within:text-blue-500 transition-colors"
                ></i>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                @input="validateEmail"
                class="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                placeholder="your@email.com"
                :disabled="isLoading"
              />
              <!-- Email validation indicator -->
              <div
                v-if="email"
                class="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <i
                  :class="
                    isValidEmail
                      ? 'fas fa-check-circle text-green-500'
                      : 'fas fa-times-circle text-red-400'
                  "
                  class="transition-all duration-200"
                ></i>
              </div>
            </div>
            <p
              v-if="email && !isValidEmail"
              class="text-xs text-red-600 flex items-center gap-1"
            >
              <i class="fas fa-exclamation-circle"></i>
              Please enter a valid email address
            </p>
          </div>

          <!-- Info Box -->
          <div
            class="bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-xl p-4"
          >
            <div class="flex items-start gap-3">
              <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <div class="text-xs text-gray-600">
                <p class="font-semibold text-gray-700 mb-1">
                  What happens next?
                </p>
                <ul class="space-y-1">
                  <li>• We'll send a reset link to your email</li>
                  <li>• Click the link to create a new password</li>
                  <li>• The link expires in 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="isLoading || !isValidEmail"
          >
            <span v-if="isLoading">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            <span v-else>
              <i class="fas fa-paper-plane"></i>
            </span>
            {{ isLoading ? "Sending..." : "Send Reset Link" }}
          </button>
        </form>

        <!-- Success Message -->
        <div
          v-if="message"
          class="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in"
        >
          <div
            class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
          >
            <i class="fas fa-check text-white"></i>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-green-800 mb-1">Success!</p>
            <p class="text-sm text-green-700">{{ message }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mt-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in"
        >
          <div
            class="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center"
          >
            <i class="fas fa-exclamation-triangle text-white"></i>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-red-800 mb-1">Error</p>
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Back to Login -->
        <div class="text-center mt-6">
          <router-link
            to="/login"
            class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <i
              class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"
            ></i>
            Back to Login
          </router-link>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-6 text-center space-y-2">
        <p class="text-xs text-gray-500 flex items-center justify-center gap-2">
          <i class="fas fa-shield-alt text-blue-500"></i>
          Your information is safe and secure
        </p>
        <p class="text-xs text-gray-500">
          Need help?
          <a href="#" class="text-blue-600 hover:text-blue-700 font-medium"
            >Contact Support</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const email = ref("");
const message = ref("");
const error = ref("");
const isLoading = ref(false);

const apiUrl = import.meta.env.VITE_APP_API_URL;

// Email validation
const isValidEmail = computed(() => {
  if (!email.value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const validateEmail = () => {
  // Trigger reactivity for validation
  email.value = email.value.trim();
};

const sendResetLink = async () => {
  isLoading.value = true;
  message.value = "";
  error.value = "";

  try {
    console.log("Sending reset link to:", email.value);
    console.log("API URL:", apiUrl);

    const response = await axios.post(`${apiUrl}/forgot-password`, null, {
      params: { email: email.value },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response.data);
    message.value =
      response.data?.data?.message ||
      "Reset link sent! Please check your email inbox.";

    // Clear email field after success
    setTimeout(() => {
      email.value = "";
    }, 3000);
  } catch (err) {
    console.error("Error details:", err);

    if (err.response) {
      // Server responded with error status
      console.error("Server error:", err.response.data);
      error.value =
        err.response.data?.message ||
        "Failed to send reset link. Please try again.";
    } else if (err.request) {
      // Request was made but no response received
      console.error("Network error - no response received:", err.request);
      error.value =
        "Network error. Please check your internet connection and try again.";
    } else {
      // Something else happened
      console.error("Error:", err.message);
      error.value = "An unexpected error occurred. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.delay-500 {
  animation-delay: 0.5s;
}

.delay-1000 {
  animation-delay: 1s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
