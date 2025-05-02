<script setup>
import DialogInfo from "@/components/DialogInfo.vue";

defineProps({
  show: Boolean,
  qrCode: String,
  formattedCountdown: String,
  countdownColorClass: String,
  isQrExpired: Boolean,
  isTransactionSuccess: Boolean,
  transactionStatus: String
});

const emit = defineEmits(['close', 'restart-payment']);
</script>

<template>
  <Teleport to="body">
    <DialogInfo
      title="Payment"
      :show="show"
      @close="emit('close')"
    >
      <div class="p-4 flex flex-col items-center">
        <h2 class="text-xl font-bold mb-4">Scan QR Code to Complete Payment</h2>
        
        <div v-if="qrCode" class="flex flex-col items-center">
          <div class="p-3 border-2 border-blue-200 rounded-lg bg-blue-50 mb-4">
            <img :src="qrCode" alt="Payment QR Code" class="w-64 h-64" />
          </div>
          
          <div class="mb-4 text-center bg-gray-50 rounded-full px-6 py-2 shadow-sm">
            <p class="text-sm text-gray-600 mb-1">QR Code expires in:</p>
            <p class="text-xl font-bold" :class="countdownColorClass">
              {{ formattedCountdown }}
            </p>
          </div>
          
          <div v-if="isQrExpired" class="mt-2 p-4 bg-red-100 text-red-700 rounded-md w-full max-w-sm">
            <p class="text-center font-medium">QR Code expired!</p>
            <p class="text-center text-sm mb-3">Please try again or close this dialog.</p>
            <button 
              @click="emit('restart-payment')" 
              class="w-full py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
              Generate New QR Code
            </button>
          </div>
          
          <div class="mt-4 p-3 rounded-md bg-gray-50 w-full max-w-sm text-center">
            <p class="text-lg font-medium" :class="{'text-green-600': isTransactionSuccess, 'text-blue-600': transactionStatus === 'Pending'}">
              Status: {{ transactionStatus || 'Pending' }}
            </p>
            <p v-if="isTransactionSuccess" class="text-green-600 mt-2">✓ Payment successful!</p>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end w-full">
          <button 
            @click="emit('close')" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Close
          </button>
        </div>
      </div>
    </DialogInfo>
  </Teleport>
</template>