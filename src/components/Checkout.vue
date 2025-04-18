<template>
<div class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-4xl font-bold mb-4">Generate KHQR</h1>

  <div class="border rounded-lg w-96 h-96 p-3 flex flex-col items-center">
    <!-- Generate QR Code Button -->
    <button
      class="bg-yellow-400 text-black py-2 px-6 rounded-full hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105"
      @click="generateQRCode"
    >
      Generate QR Code
    </button>

    <!-- Show QR Code -->
    <img v-if="qrCode" :src="'data:image/png;base64,' + qrCode" alt="KHQR Code" class="mt-4" />

    <!-- Transaction Status -->
    <p v-if="transactionStatus" class="mt-4 text-lg font-semibold">
      Transaction Status: {{ transactionStatus }}
    </p>
  </div>
</div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const qrCode = ref(""); // Stores QR Code Base64 string
const md5Hash = ref(""); // Stores extracted MD5 hash
const transactionStatus = ref(""); // Stores transaction status
let intervalId = null; // Stores the interval ID
let timeoutId = null; // Stores the timeout ID

// Function to generate KHQR
const generateQRCode = async () => {
try {
  const response = await axios.post(`${apiUrl}/payment/generate-khqr`, {
    amount: 100, // Set amount dynamically
  });

  if (response.data.qrCode) {
    qrCode.value = response.data.qrCode;
    md5Hash.value = response.data.md5;
    console.log("Generated QR Code:", qrCode.value);
    console.log("MD5 Hash:", md5Hash.value);
    startAutoCheck();
  } else {
    console.error("Error generating KHQR:", response.data.error);
  }
} catch (error) {
  console.error("API Error:", error);
}
};

// Function to check transaction status
const checkTransaction = async () => {
try {
  const response = await axios.post(`${apiUrl}/payment/check`, {
    md5: md5Hash.value, // 🔹 Use MD5 instead of QR string
  });

  transactionStatus.value = response.data.responseMessage;
  console.log("Transaction Status:", transactionStatus.value);
  console.log("Response Data:", response);

  // Stop checking if transaction is successful
  if (transactionStatus.value.toLowerCase() === "success") {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  }
} catch (error) {
  console.error("Error checking transaction:", error);
  transactionStatus.value = "Error checking transaction";
}
};

// Function to start auto-checking transaction status
const startAutoCheck = () => {
if (intervalId) {
  clearInterval(intervalId);
}
intervalId = setInterval(checkTransaction, 3000); // Check every 3 seconds

// Stop checking after 1 minute
if (timeoutId) {
  clearTimeout(timeoutId);
}
timeoutId = setTimeout(() => {
  clearInterval(intervalId);
}, 60000); // Stop after 60 seconds
};

// Cleanup interval and timeout on component unmount
onUnmounted(() => {
if (intervalId) {
  clearInterval(intervalId);
}
if (timeoutId) {
  clearTimeout(timeoutId);
}
});
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
