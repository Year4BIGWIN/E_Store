<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/CartItem.vue";
import DialogInfo from "@/components/DialogInfo.vue";
import Map from "@/components/Map.vue";
import QRCode from "qrcode";
import Cookies from "universal-cookie";

const cartStore = useCartStore();
const showCheckoutDialog = ref(false);
const showPaymentDialog = ref(false);
const cookies = new Cookies();
const paymentInfo = ref(null);
const qrCode = ref(null);
const md5Hash = ref(null);
const transactionStatus = ref(null);
const apiUrl = import.meta.env.VITE_APP_API_URL;

const qrCodeExpirySeconds = ref(60); // 60 seconds expiry time
const remainingSeconds = ref(0);
let countdownIntervalId = null;

let intervalId = null;
let timeoutId = null;

onMounted(() => {
  cartStore.fetchCart(); 
});

const getToken = () => {
  const token = cookies.get("auth_token");
  return token && token.split(".").length === 3 ? token : null;
};

const getAuthHeaders = () => {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : null;
};

const proceedToPayment = async () => {
  showCheckoutDialog.value = false;
  await checkout();
  showPaymentDialog.value = true;
};

const checkout = async () => {
  const headers = getAuthHeaders();
  if (!headers || cartStore.cartItems.length === 0) return;

  try {
    const res = await fetch(`${apiUrl}/order/checkout`, {
      method: "POST",
      headers,
    });
    const data = await res.json();
    console.log("Checkout response:", data);

    if (res.ok && data.data?.qr) {
      paymentInfo.value = data.data;
      md5Hash.value = data.data.md5;
      transactionStatus.value = data.responseMessage;
      qrCode.value = await QRCode.toDataURL(data.data.qr);
      console.log("Generated QR Code:", qrCode.value);
      startTransactionPolling();
      startCountdownTimer(); // Start the countdown
    } else {
      alert(data.message || "Checkout failed.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
  }
};

const checkTransactionStatus = async () => {
  try {
    const res = await fetch(`${apiUrl}/order/confirm-payment?md5=${md5Hash.value}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      console.error(`Error: Received status ${res.status} from /confirm-payment`);
      transactionStatus.value = "Error checking transaction status";
      return;
    }

    const contentType = res.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    console.log("Transaction status response:", data);

    if (typeof data === "string") {
      if (data.toLowerCase() === "success") {
        transactionStatus.value = "Success";
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        clearInterval(countdownIntervalId); // Clear countdown on success
        await cartStore.fetchCart();
      } else if (data.toLowerCase() === "pending") {
        transactionStatus.value = "Pending";
      } else {
        transactionStatus.value = data || "Unknown status";
      }
    } else if (data.responseMessage?.toLowerCase() === "success") {
      transactionStatus.value = "Success";
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      clearInterval(countdownIntervalId); // Clear countdown on success
      await cartStore.fetchCart();
    } else if (data.responseMessage?.toLowerCase() === "pending") {
      transactionStatus.value = "Pending";
    } else {
      transactionStatus.value = data.responseMessage || "Unknown status";
    }
  } catch (err) {
    console.error("Error checking transaction status:", err);
    transactionStatus.value = "Error checking transaction status";
  }
};

const startTransactionPolling = () => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
  intervalId = setInterval(checkTransactionStatus, 3000);
  timeoutId = setTimeout(() => clearInterval(intervalId), 60000);
};

const startCountdownTimer = () => {
  clearInterval(countdownIntervalId);
  remainingSeconds.value = qrCodeExpirySeconds.value;
  
  countdownIntervalId = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--;
    } else {
      clearInterval(countdownIntervalId);
    }
  }, 1000);
};

// Format countdown time (MM:SS)
const formattedCountdown = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = (remainingSeconds.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

// Countdown color based on remaining time
const countdownColorClass = computed(() => {
  if (remainingSeconds.value < 10) return 'text-red-600';
  if (remainingSeconds.value < 30) return 'text-orange-500';
  return 'text-blue-600';
});

// QR code expired state
const isQrExpired = computed(() => 
  remainingSeconds.value <= 0 && transactionStatus.value !== 'Success'
);

// Transaction success state
const isTransactionSuccess = computed(() => 
  transactionStatus.value === 'Success'
);

const restartPaymentProcess = async () => {
  // Reset states
  qrCode.value = null;
  paymentInfo.value = null;
  md5Hash.value = null;
  transactionStatus.value = null;
  
  // Generate new payment QR
  await checkout();
};

onUnmounted(() => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
  clearInterval(countdownIntervalId);
});
</script>

<template>
  <div class="w-[1152px] border rounded-xl my-10 flex flex-col gap-1 p-5">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">My Cart</h1>
      <h1>{{ cartStore.cartItems.length }} Items</h1>
    </div>
    <div class="w-full flex justify-between">
      <h1 class="w-2/5">Product</h1>
      <div class="w-3/5 justify-between flex">
        <h1>Price</h1>
        <h1>Quantity</h1>
        <h1 class="mr-24">Sub Total</h1>
      </div>
    </div>
    <hr class="w-full" />
    <div class="w-full flex gap-4 flex-col h-[400px] overflow-y-scroll">
      <div v-for="item in cartStore.cartItems" :key="item.id">
        <CartItem :cart="item" @update-cart="cartStore.fetchCart" />
      </div>
    </div>
    <hr class="w-full" />
    <div class="w-full flex justify-end">
      <div class="w-fit flex flex-col gap-4">
        <h1 class="text-xl font-bold">Total: ${{ cartStore.totalPrice }}</h1>
        <button 
          @click="showCheckoutDialog = true" 
          class="hover:brightness-90 text-white bg-black py-1 px-3 border-2 rounded-xl">
          CheckOut
        </button>
      </div>
    </div>
    
    <!-- Checkout Dialog -->
    <DialogInfo
      title="Checkout"
      :show="showCheckoutDialog"
      @close="showCheckoutDialog = false"
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-medium">Order Summary</h2>
        
        <div class="max-h-60 overflow-y-auto">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="flex justify-between py-2 border-b">
            <div class="flex items-center gap-2">
              <img :src="item.phone.firstImageUrl" class="w-12 h-12 object-cover rounded" alt="Product image" />
              <div>
                <p class="font-medium">{{ item.phone.model }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
            </div>
            <p class="font-medium">${{ item.phone.price }}</p>
          </div>
        </div>
        
        <div class="pt-2 border-t">
          <div class="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${{ cartStore.totalPrice }}</span>
          </div>
        </div>
        
        <div class="flex flex-col gap-3 mt-2">
          <h3 class="font-medium">Shipping Address</h3>
          <div class="h-[200px] bg-gray-100 rounded-lg p-3">
            <Map></Map>
          </div>
          
          <div class="flex justify-end gap-3 mt-2">
            <button 
              @click="showCheckoutDialog = false" 
              class="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button 
              @click="proceedToPayment"
              class="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </DialogInfo>

    <!-- Payment Dialog -->
    <DialogInfo
      title="Payment"
      :show="showPaymentDialog"
      @close="showPaymentDialog = false"
    >
      <div class="p-4 flex flex-col items-center">
        <h2 class="text-xl font-bold mb-4">Scan QR Code to Complete Payment</h2>
        
        <div v-if="qrCode" class="flex flex-col items-center">
          <img :src="qrCode" alt="Payment QR Code" class="w-64 h-64 mb-4" />
          
          <!-- Countdown Timer -->
          <div class="mb-4 text-center">
            <p class="text-sm text-gray-600 mb-1">QR Code expires in:</p>
            <p class="text-xl font-bold" :class="countdownColorClass">
              {{ formattedCountdown }}
            </p>
          </div>
          
          <!-- Expiry Message -->
          <div v-if="isQrExpired" class="mt-2 p-2 bg-red-100 text-red-700 rounded-md">
            <p class="text-center font-medium">QR Code expired!</p>
            <p class="text-center text-sm mb-2">Please try again or close this dialog.</p>
            <button 
              @click="restartPaymentProcess" 
              class="w-full py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700">
              Generate New QR Code
            </button>
          </div>
          
          <!-- Status Message -->
          <p class="mt-4 text-lg font-medium" :class="{'text-green-600': isTransactionSuccess}">
            Status: {{ transactionStatus || 'Pending' }}
          </p>
        </div>
        
        <div class="mt-6 flex justify-end w-full">
          <button 
            @click="showPaymentDialog = false" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Close
          </button>
        </div>
      </div>
    </DialogInfo>
  </div>
</template>