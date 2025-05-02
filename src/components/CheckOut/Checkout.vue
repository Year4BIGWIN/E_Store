<script setup>
import { ref } from "vue";
import { useCartStore } from "@/store/cartStore";
import usePayment from "@/composable/usePayment";
import useToast from "@/composable/useToast";
import useAuth from "@/composable/useAuth";

// Import components
import CheckoutButton from "@/components/CheckOut/CheckoutButton.vue";
import CheckoutDialog from "@/components/CheckOut/CheckoutDialog.vue";
import PaymentDialog from "@/components/CheckOut/PaymentDialog.vue";
import RemoveConfirmationDialog from "@/components/CheckOut/RemoveConfirmDialog.vue";
import ToastNotification from "@/components/CheckOut/ToastNotification.vue";

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  showButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['payment-successful', 'update-cart']);

// UI state
const showCheckoutDialog = ref(false);
const showPaymentDialog = ref(false);
const itemToRemove = ref(null);
const showRemoveConfirmation = ref(false);
const userAddress = ref(null);

// Services and composables
const apiUrl = import.meta.env.VITE_APP_API_URL;
const cartStore = useCartStore();
const { getToken, getAuthHeaders } = useAuth();
const { toast, showToast } = useToast();
const payment = usePayment(apiUrl, getAuthHeaders);

// Methods
const proceedToPayment = async () => {
  showCheckoutDialog.value = false;
  const success = await payment.checkout();
  if (success) {
    showPaymentDialog.value = true;
  } else {
    showToast("Failed to initialize payment", "error");
  }
};

const handlePaymentSuccess = () => {
  emit('payment-successful');
  emit('update-cart');
  showToast("Payment successful! Your order is being processed.", "success");
  showPaymentDialog.value = false;
};

// Cart item management
const confirmRemoveItem = (itemId) => {
  const item = props.cartItems.find(item => item.id === itemId);
  if (!item) return;
  itemToRemove.value = item;
  showRemoveConfirmation.value = true;
};

const executeRemoveItem = async () => {
  if (!itemToRemove.value) return;
  
  try {
    await fetch(`${apiUrl}/cart/remove/${itemToRemove.value.phone.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    
    await cartStore.fetchCart();
    emit('update-cart');
    showToast(`${itemToRemove.value.phone.model} removed from cart`);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    showToast("Failed to remove item from cart", "error");
  } finally {
    showRemoveConfirmation.value = false;
    itemToRemove.value = null;
  }
};

const updateItemQuantity = async (itemId, newQuantity) => {
  const currentItem = props.cartItems.find(item => item.id === itemId);
  if (!currentItem) return;
  
  const currentQuantity = currentItem.quantity;
  
  if (newQuantity <= 0) {
    confirmRemoveItem(itemId);
    return;
  }
  
  try {
    if (newQuantity > currentQuantity) {
      await fetch(`${apiUrl}/cart/addOne/${currentItem.phone.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      showToast(`Increased ${currentItem.phone.model} quantity`);
    } else {
      await fetch(`${apiUrl}/cart/removeOne/${currentItem.phone.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      showToast(`Decreased ${currentItem.phone.model} quantity`);
    }
    
    await cartStore.fetchCart();
    emit('update-cart');
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    showToast("Failed to update quantity", "error");
  }
};

const openCheckout = () => {
  showCheckoutDialog.value = true;
};

// Expose method for parent component to call
defineExpose({ openCheckout });
</script>

<template>
  <div>
    <CheckoutButton 
      :showButton="showButton" 
      @click="openCheckout" 
    />
    
    <CheckoutDialog
      :show="showCheckoutDialog"
      :cartItems="cartItems"
      :totalPrice="totalPrice"
      :userAddress="userAddress"
      @close="showCheckoutDialog = false"
      @proceed-payment="proceedToPayment"
      @update-quantity="updateItemQuantity"
      @remove-item="confirmRemoveItem"
    />

    <PaymentDialog
      :show="showPaymentDialog"
      :qrCode="payment.qrCode"
      :formattedCountdown="payment.formattedCountdown"
      :countdownColorClass="payment.countdownColorClass"
      :isQrExpired="payment.isQrExpired"
      :isTransactionSuccess="payment.isTransactionSuccess"
      :transactionStatus="payment.transactionStatus"
      @close="showPaymentDialog = false"
      @restart-payment="payment.restartPaymentProcess"
    />

    <RemoveConfirmationDialog
      :show="showRemoveConfirmation"
      :itemName="itemToRemove?.phone?.model"
      @confirm="executeRemoveItem"
      @cancel="showRemoveConfirmation = false"
    />

    <ToastNotification :toast="toast" />
  </div>
</template>

<style scoped>
:deep(.dialog-backdrop) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 100;
}

:deep(.dialog-container) {
  max-width: 90%;
  transform: translateY(0);
  position: relative;
  top: 0;
}

:deep(.dialog-enter-active),
:deep(.dialog-leave-active) {
  transition: opacity 0.3s, transform 0.3s;
}

:deep(.dialog-enter-from),
:deep(.dialog-leave-to) {
  opacity: 0;
  transform: translateY(20px);
}
</style>