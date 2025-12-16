<script setup>
import { ref, computed, onUnmounted } from "vue";
import DialogInfo from "@/components/DialogInfo.vue";
import CheckoutDialog from "./CheckoutDialog.vue";
import PaymentSuccessDialog from "./PaymentSuccess.vue"; // Import the new component
import QRCode from "qrcode";
import Cookies from "universal-cookie";
import router from "@/router";
import { toast } from "vue3-toastify";
import { useCartStore } from "@/store/cartStore";

const cartStore = useCartStore();

const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  showButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "payment-successful",
  "update-cart",
  "update-quantity",
  "remove-item",
  "after-payment-close",
]);

const showCheckoutDialog = ref(false);
const showPaymentDialog = ref(false);
const showPaymentSuccessDialog = ref(false); // Add new ref for success dialog
const cookies = new Cookies();
const paymentInfo = ref(null);
const qrCode = ref(null);
const md5Hash = ref(null);
const transactionStatus = ref(null);
const apiUrl = import.meta.env.VITE_APP_API_URL;
// User address could be fetched from user profile or entered during checkout
const userAddress = ref("123 Main St, Anytown, USA");

const qrCodeExpirySeconds = ref(60); // 60 seconds expiry time
const remainingSeconds = ref(0);
let countdownIntervalId = null;

let intervalId = null;
let timeoutId = null;

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
  const success = await checkout();
  // Only show payment dialog if checkout was successful
  if (success) {
    showPaymentDialog.value = true;
  }
};

const checkout = async () => {
  const headers = getAuthHeaders();
  if (!headers || props.cartItems.length === 0) return false;

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
      return true;
    } else {
      toast.error("Checkout failed: " + "don't have location");
      return false;
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return false;
  }
};

// Handle cart item quantity updates
const handleUpdateQuantity = (id, qty) => {
  emit("update-quantity", id, qty);
};

const navigateToProfile = async () => {
  showPaymentSuccessDialog.value = false;

  try {
    // Wait for the navigation to complete
    await router.push("/profile");
    // Only fetch cart after navigation is successful
    cartStore.fetchCart();
  } catch (error) {
    console.error("Navigation error:", error);
    // Still try to fetch cart even if navigation fails
    cartStore.fetchCart();
  }
};

// Handle cart item removal
const handleRemoveItem = (id) => {
  emit("remove-item", id);
};

const checkTransactionStatus = async () => {
  try {
    const res = await fetch(
      `${apiUrl}/order/confirm-payment?md5=${md5Hash.value}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      console.error(
        `Error: Received status ${res.status} from /confirm-payment`
      );
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

    console.log("Transaction status response:", data); // Keep this log

    if (typeof data === "string") {
      console.log("Received string response:", data);
      if (data.toLowerCase() === "success") {
        console.log("String success detected, showing success dialog");
        transactionStatus.value = "Success";
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        clearInterval(countdownIntervalId);

        // First hide payment dialog
        showPaymentDialog.value = false;

        // Small delay to ensure UI updates properly
        setTimeout(() => {
          showPaymentSuccessDialog.value = true;
          console.log(
            "Success dialog visibility set to:",
            showPaymentSuccessDialog.value
          );

          // Only emit payment-successful, not update-cart
          setTimeout(() => {
            emit("payment-successful");
          }, 100);
        }, 300);
      } else if (data.toLowerCase() === "pending") {
        transactionStatus.value = "Pending";
      } else {
        transactionStatus.value = data || "Unknown status";
      }
    } else if (data.responseMessage) {
      console.log("Response message:", data.responseMessage);
      if (data.responseMessage.toLowerCase() === "success") {
        console.log("Object success detected, showing success dialog");
        transactionStatus.value = "Success";
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        clearInterval(countdownIntervalId);

        showPaymentDialog.value = false;

        setTimeout(() => {
          showPaymentSuccessDialog.value = true;
          console.log(
            "Success dialog visibility set to:",
            showPaymentSuccessDialog.value
          );

          // Only emit payment-successful, not update-cart
          setTimeout(() => {
            emit("payment-successful");
          }, 100);
        }, 300);
      } else if (data.responseMessage.toLowerCase() === "pending") {
        transactionStatus.value = "Pending";
      } else {
        transactionStatus.value = data.responseMessage || "Unknown status";
      }
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
  const seconds = (remainingSeconds.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

// Countdown color based on remaining time
const countdownColorClass = computed(() => {
  if (remainingSeconds.value < 10) return "text-red-600";
  if (remainingSeconds.value < 30) return "text-orange-500";
  return "text-blue-600";
});

// QR code expired state
const isQrExpired = computed(
  () => remainingSeconds.value <= 0 && transactionStatus.value !== "Success"
);

// Transaction success state
const isTransactionSuccess = computed(
  () => transactionStatus.value === "Success"
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

const openCheckout = () => {
  showCheckoutDialog.value = true;
};

// Handle continue shopping button from success dialog
const handleContinueShopping = () => {
  showPaymentSuccessDialog.value = false;
};

// Prevent accidental closing
const closeSuccessDialog = () => {
  console.log("Closing success dialog");
  showPaymentSuccessDialog.value = false;
  handleAfterModalClose();
};

const handleAfterModalClose = () => {
  console.log("Success modal closed, updating cart");
  emit("after-payment-close");
  emit("update-cart");
};

// Add this line to expose the method to parent components
defineExpose({ openCheckout });

onUnmounted(() => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
  clearInterval(countdownIntervalId);
});
</script>

<template>
  <div>
    <!-- Checkout button (optional, controlled by prop) -->
    <button
      v-if="showButton"
      @click="openCheckout"
      class="hover:brightness-90 text-white bg-black py-1 px-3 border-2 rounded-xl"
    >
      Checkout
    </button>

    <!-- Use CheckoutDialog component for checkout information -->
    <CheckoutDialog
      :show="showCheckoutDialog"
      :cartItems="cartItems"
      :totalPrice="totalPrice"
      :userAddress="userAddress"
      @close="showCheckoutDialog = false"
      @proceed-payment="proceedToPayment"
      @update-quantity="handleUpdateQuantity"
      @remove-item="handleRemoveItem"
    />

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
            <p class="text-sm mb-1">QR Code expires in:</p>
            <span
              class="text-xl font-mono font-bold"
              :class="countdownColorClass"
            >
              {{ formattedCountdown }}
            </span>
          </div>

          <!-- Expiry Message -->
          <div
            v-if="isQrExpired"
            class="mt-2 p-2 bg-red-100 text-red-700 rounded-md"
          >
            <p class="font-medium">QR Code has expired</p>
            <p class="text-sm">Please generate a new code to continue</p>
          </div>

          <!-- Status Message -->
          <p
            class="mt-4 text-lg font-medium"
            :class="{ 'text-green-600': isTransactionSuccess }"
          >
            Status: {{ transactionStatus || "Awaiting payment" }}
          </p>
        </div>

        <div class="mt-6 flex justify-end w-full">
          <button
            v-if="isQrExpired && !isTransactionSuccess"
            @click="restartPaymentProcess"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Generate New Code
          </button>
        </div>
      </div>
    </DialogInfo>

    <!-- New Payment Success Dialog -->
    <teleport to="body">
      <PaymentSuccessDialog
        v-if="showPaymentSuccessDialog"
        @close="closeSuccessDialog"
        @after-close="handleAfterModalClose"
        @profile="navigateToProfile"
      />
    </teleport>
  </div>
</template>

<style scoped></style>
