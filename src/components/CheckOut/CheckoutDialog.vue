<script setup>
import { ref } from "vue";
import DialogInfo from "@/components/DialogInfo.vue";
import Map from "@/components/Location/Map.vue";
import CartItem from "./CartItem.vue";

const props = defineProps({
  show: Boolean,
  cartItems: {
    type: Array,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  userAddress: String,
});

const emit = defineEmits([
  "close",
  "proceed-payment",
  "update-quantity",
  "remove-item",
]);

const selectedPaymentMethod = ref("");

const paymentMethods = [
  {
    id: "qr",
    name: "QR Code Payment",
    description: "Scan & Pay with KHQR",
    icon: "fa-qrcode",
    recommended: true,
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    description: "Pay when you receive",
    icon: "fa-money-bill-wave",
    recommended: false,
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Coming soon",
    icon: "fa-credit-card",
    disabled: true,
  },
];

const selectPaymentMethod = (methodId) => {
  const method = paymentMethods.find((m) => m.id === methodId);
  if (!method?.disabled) {
    selectedPaymentMethod.value = methodId;
  }
};
</script>

<template>
  <Teleport to="body">
    <DialogInfo
      title="Checkout"
      :show="show"
      @close="emit('close')"
      class="checkout-dialog"
    >
      <div
        class="flex flex-col lg:flex-row gap-4 lg:gap-6 max-h-[85vh] overflow-hidden"
      >
        <!-- Left Column: Order Summary -->
        <div class="flex flex-col gap-4 lg:w-1/2">
          <h2 class="text-lg font-semibold">Order Summary</h2>

          <div
            class="max-h-[25vh] lg:max-h-[35vh] overflow-y-auto border rounded-lg"
          >
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
              @update-quantity="(id, qty) => emit('update-quantity', id, qty)"
              @remove-item="(id) => emit('remove-item', id)"
            />
          </div>

          <div class="py-3 border-t border-b bg-gray-50 rounded-lg px-4">
            <div class="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span class="text-blue-600">${{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <details class="bg-white rounded-lg shadow-sm border" open>
            <summary
              class="p-4 font-medium flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"
                />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Shipping Address
            </summary>
            <div class="px-4 pb-4">
              <div class="rounded-lg overflow-hidden border">
                <Map class="h-[180px]"></Map>
              </div>
            </div>
          </details>
        </div>

        <!-- Right Column: Payment Method -->
        <div class="flex flex-col gap-4 lg:w-1/2">
          <h2 class="text-lg font-semibold">Payment Method</h2>

          <div
            class="flex flex-col gap-3 overflow-y-auto max-h-[50vh] lg:max-h-[60vh] pr-1"
          >
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              @click="selectPaymentMethod(method.id)"
              :class="[
                'relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
                selectedPaymentMethod === method.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
                method.disabled ? 'opacity-50 cursor-not-allowed' : '',
              ]"
            >
              <!-- Recommended Badge -->
              <div
                v-if="method.recommended"
                class="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
              >
                Recommended
              </div>

              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div
                  :class="[
                    'flex items-center justify-center w-12 h-12 rounded-lg',
                    selectedPaymentMethod === method.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  <i :class="`fa-solid ${method.icon} text-xl`"></i>
                </div>

                <!-- Content -->
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-base">{{ method.name }}</h3>
                    <span
                      v-if="method.disabled"
                      class="text-xs text-gray-500 italic"
                      >(Coming Soon)</span
                    >
                  </div>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ method.description }}
                  </p>
                </div>

                <!-- Radio Button -->
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedPaymentMethod === method.id
                        ? 'border-blue-600'
                        : 'border-gray-300',
                    ]"
                  >
                    <div
                      v-if="selectedPaymentMethod === method.id"
                      class="w-3 h-3 rounded-full bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex gap-3 mt-auto pt-4 border-t sticky bottom-0 bg-white"
          >
            <button
              @click="emit('close')"
              class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="emit('proceed-payment')"
              :disabled="!selectedPaymentMethod"
              :class="[
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                selectedPaymentMethod
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              <span class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-lock text-sm"></i>
                Proceed to Payment
              </span>
            </button>
          </div>
        </div>
      </div>
    </DialogInfo>
  </Teleport>
</template>

<style scoped>
.checkout-dialog {
  max-height: 100vh;
  overflow: hidden;
}

/* Override DialogInfo's max-w-sm to make checkout dialog wider */
:deep(.bg-white.rounded-lg.shadow-xl) {
  max-width: 1000px !important;
  width: 95vw;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::after {
  content: "▼";
  float: right;
  margin-left: 10px;
  font-size: 0.8em;
  color: #666;
  transform: rotate(0);
  transition: transform 0.2s;
}

details[open] summary::after {
  transform: rotate(180deg);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
