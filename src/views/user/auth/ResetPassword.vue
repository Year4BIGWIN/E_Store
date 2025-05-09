<template>
  <div class="flex flex-col items-center justify-center min-h-screen ">
    <div class="bg-white p-8 rounded shadow-md w-[400px]">
      <h1 class="text-2xl font-bold mb-4 text-center">Reset Password</h1>
      <form @submit.prevent="resetPassword">
        <div class="mb-4">
          <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-700">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            id="newPassword"
            class="w-full p-2 border rounded"
            placeholder="Enter new password"
            required
          />
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            class="w-full p-2 border rounded"
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const newPassword = ref('');
const confirmPassword = ref('');

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const token = route.query.token;
    await axios.post(`${apiUrl}/reset-password`, {
      token: token,
      newPassword: newPassword.value,
    });
    alert('Password reset successfully!');
    router.push('/login'); // Redirect to login page after successful reset
  } catch (error) {
    console.error(error);
    alert('Failed to reset password!');
  }
};
</script>
