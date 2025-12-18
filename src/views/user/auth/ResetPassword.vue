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
            <i class="fas fa-key text-white text-2xl"></i>
          </div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
          >
            Reset Password
          </h1>
          <p class="text-gray-600 text-sm">
            Create a strong new password for your account
          </p>
        </div>

        <form @submit.prevent="resetPassword" class="space-y-5">
          <!-- New Password Field -->
          <div class="space-y-2">
            <label
              for="newPassword"
              class="block text-sm font-semibold text-gray-700"
            >
              New Password
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-lock text-gray-400 group-focus-within:text-blue-500 transition-colors"
                ></i>
              </div>
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                @input="checkPasswordStrength"
                class="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                placeholder="Enter your new password"
                :disabled="isLoading"
                required
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                :disabled="isLoading"
              >
                <i
                  :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="newPassword" class="space-y-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1.5 flex-1 rounded-full transition-all duration-300"
                  :class="
                    i <= passwordStrength
                      ? strengthColors[passwordStrength]
                      : 'bg-gray-200'
                  "
                ></div>
              </div>
              <p
                class="text-xs font-medium"
                :class="strengthTextColors[passwordStrength]"
              >
                {{ strengthLabels[passwordStrength] }}
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label
              for="confirmPassword"
              class="block text-sm font-semibold text-gray-700"
            >
              Confirm Password
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-lock text-gray-400 group-focus-within:text-blue-500 transition-colors"
                ></i>
              </div>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                class="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                placeholder="Confirm your new password"
                :disabled="isLoading"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                :disabled="isLoading"
              >
                <i
                  :class="
                    showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                  "
                ></i>
              </button>
            </div>

            <!-- Password Match Indicator -->
            <div v-if="confirmPassword" class="flex items-center gap-2 text-xs">
              <i
                :class="
                  passwordsMatch
                    ? 'fas fa-check-circle text-green-500'
                    : 'fas fa-times-circle text-red-500'
                "
              ></i>
              <span :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
                {{
                  passwordsMatch ? "Passwords match" : "Passwords do not match"
                }}
              </span>
            </div>
          </div>

          <!-- Password Requirements -->
          <div
            class="bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-xl p-4"
          >
            <p class="text-xs font-semibold text-gray-700 mb-2">
              Password must contain:
            </p>
            <ul class="space-y-1 text-xs text-gray-600">
              <li class="flex items-center gap-2">
                <i
                  :class="
                    newPassword.length >= 6
                      ? 'fas fa-check-circle text-green-500'
                      : 'fas fa-circle text-gray-300'
                  "
                  class="text-xs"
                ></i>
                At least 6 characters
              </li>
              <li class="flex items-center gap-2">
                <i
                  :class="
                    /[A-Z]/.test(newPassword)
                      ? 'fas fa-check-circle text-green-500'
                      : 'fas fa-circle text-gray-300'
                  "
                  class="text-xs"
                ></i>
                One uppercase letter
              </li>
              <li class="flex items-center gap-2">
                <i
                  :class="
                    /[0-9]/.test(newPassword)
                      ? 'fas fa-check-circle text-green-500'
                      : 'fas fa-circle text-gray-300'
                  "
                  class="text-xs"
                ></i>
                One number
              </li>
            </ul>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="isLoading || !passwordsMatch"
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
              <i class="fas fa-check-circle"></i>
            </span>
            {{ isLoading ? "Resetting Password..." : "Reset Password" }}
          </button>
        </form>

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

      <!-- Security Note -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 flex items-center justify-center gap-2">
          <i class="fas fa-shield-alt text-blue-500"></i>
          Your password is encrypted and secure
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const newPassword = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordStrength = ref(0);

const strengthColors = {
  0: "bg-gray-200",
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
};

const strengthTextColors = {
  0: "text-gray-500",
  1: "text-red-600",
  2: "text-orange-600",
  3: "text-yellow-600",
  4: "text-green-600",
};

const strengthLabels = {
  0: "Enter a password",
  1: "Weak password",
  2: "Fair password",
  3: "Good password",
  4: "Strong password",
};

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return false;
  return newPassword.value === confirmPassword.value;
});

const checkPasswordStrength = () => {
  const password = newPassword.value;
  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  passwordStrength.value = Math.min(strength, 4);
};

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error("Passwords do not match!");
    return;
  }

  if (newPassword.value.length < 6) {
    toast.error("Password must be at least 6 characters long!");
    return;
  }

  isLoading.value = true;

  try {
    const token = route.query.token;

    if (!token) {
      toast.error("Invalid or missing reset token!");
      isLoading.value = false;
      return;
    }

    console.log("Resetting password with token");

    const response = await axios.post(`${apiUrl}/reset-password`, {
      token: token,
      newPassword: newPassword.value,
    });

    console.log("Response:", response.data);
    toast.success(
      response.data?.data?.message || "Password reset successfully!"
    );

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Error details:", error);

    if (error.response) {
      toast.error(error.response.data?.message || "Failed to reset password!");
    } else if (error.request) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
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
</style>
