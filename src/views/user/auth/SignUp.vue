<template>
  <div
    class="w-[100vw] max-w-[1024px] px-4 my-6 md:px-0 md:my-10 md:bg-[#d9d9d9] rounded-xl flex flex-col md:flex-row items-center justify-between"
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
              class="block mb-2 text-sm font-medium text-gray-900"
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
              class="block mb-2 text-sm font-medium text-gray-900"
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
            class="block mb-2 text-sm font-medium text-gray-900"
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

        <div class="relative mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Password</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="***********"
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

        <div class="relative mb-5">
          <label
            for="confirm-password"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Confirm Password</label
          >
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            id="confirm-password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="***********"
          />
          <button
            type="button"
            class="absolute top-10 right-3 flex items-center text-gray-500"
            @click="toggleConfirmPassword"
          >
            <i
              :class="
                showConfirmPassword
                  ? 'fa-solid fa-eye-slash'
                  : 'fa-solid fa-eye'
              "
            ></i>
          </button>
          <div v-if="passwordError" class="mt-1 text-red-500 text-sm">
            {{ passwordError }}
          </div>
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-3 text-center"
        >
          Sign Up
        </button>
      </form>
      <div class="mt-5 text-center">
        Already have an account?
        <router-link class="text-blue-700 hover:text-blue-500" to="/login"
          >Login</router-link
        >
      </div>
      <div
        class="w-full max-w-sm mb-5 flex justify-center items-center px-4 md:px-0"
      >
        <hr class="w-full md:w-[125px] border-gray-300" />
        <span class="mx-2 mt-2 whitespace-nowrap">Or Sign Up with</span>
        <hr class="w-full md:w-[125px] border-gray-300" />
      </div>

      <!-- Google Sign-in Button -->
      <div id="googleSignInButton"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/store/authStore";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const passwordError = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Sign-Up form submit
const signup = async () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match";
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
    router.push("/");
  } catch (error) {
    console.error(
      "Sign-Up failed:",
      error.response.data.data.error
      
    );
    toast.error(error.response.data.data.error);
  }
};

// Google Sign-In callback
const handleGoogleCredentialResponse = async (response) => {
  try {
    const res = await axios.post(`${apiUrl}/google-signup`, {
      token: response.credential,
    });

    const data = res.data;

    if (data.status === "200") {
      const token = data.data.token;
      const role = data.data.role;

      authStore.setAuthData(token, role);
      router.push("/");
    } else {
      console.error("Google Sign-Up failed:", data.message);
      alert("Google Sign-Up failed: " + data.message);
      console.error("Error details:", data);
    }
  } catch (error) {
    console.error(
      "Error during Google Sign-Up:",
      error.response?.data || error.message
    );
    alert("An error occurred during Google Sign-Up. Please try again.");
  }
};

// Google Sign-In initialization
const initGoogleSignIn = () => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredentialResponse,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  } else {
    console.error("Google Identity script not loaded.");
  }
};

onMounted(() => {
  initGoogleSignIn();
});
</script>
