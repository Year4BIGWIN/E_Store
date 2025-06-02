<script setup>
import { defineEmits, onMounted, ref } from 'vue';

const emit = defineEmits(['close', 'profile', 'after-close']);
const showConfetti = ref(false);

const closeDialog = () => {
  emit('close');
  emit('after-close');
};

const viewMyOrders = () => {
  emit('profile');
};

onMounted(() => {
  setTimeout(() => {
    showConfetti.value = true;
  }, 300);
});
</script>

<template>
  <!-- Change this to have higher z-index and remove possible nesting issues -->
  <div class="fixed inset-0 z-[10000] flex items-center justify-center">
    <!-- Make sure backdrop has lower z-index than content -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001]" @click="closeDialog"></div>
    
    <!-- Ensure content has highest z-index and proper width -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto relative z-[10002] animate-slide-in">
      <div class="confetti-container" v-if="showConfetti">
        <div v-for="i in 50" :key="i" class="confetti" :style="`--delay: ${Math.random() * 5}s; --left: ${Math.random() * 100}%;`"></div>
      </div>

      <div class="flex flex-col items-center justify-center text-center">
        <div class="mb-6 relative">
          <div class="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full scale-150 animate-pulse-slow"></div>
          <div class="relative bg-green-500 text-white rounded-full p-5 shadow-lg shadow-green-200 dark:shadow-green-900/30 animate-scale-in">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-3 animate-fade-in">Payment Successful!</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-delay">Thank you for your purchase. Your order has been confirmed.</p>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full animate-fade-in-delay-3">
          <button 
            @click="viewMyOrders"
            class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
            </svg>
            My Orders
          </button>
          <button 
            @click="closeDialog" 
            class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-scale-in {
  animation: scaleIn 0.5s 0.2s backwards cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-pulse-slow {
  animation: pulse 2s infinite;
}

.animate-fade-in {
  animation: fadeIn 0.5s 0.4s backwards;
}

.animate-fade-in-delay {
  animation: fadeIn 0.5s 0.5s backwards;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 0.5s 0.6s backwards;
}

.animate-fade-in-delay-3 {
  animation: fadeIn 0.5s 0.7s backwards;
}

@keyframes slideIn {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10003;
}

.confetti {
  position: absolute;
  top: -10px;
  left: var(--left, 50%);
  width: 10px;
  height: 10px;
  background: linear-gradient(
    135deg,
    #ff6b6b, #feca57, #48dbfb, #1dd1a1, #f368e0
  );
  animation: confetti 3s var(--delay, 0s) ease-in infinite;
  transform-origin: center;
}

.confetti:nth-child(even) {
  background: linear-gradient(
    135deg,
    #54a0ff, #ff9ff3, #ff9f43, #00d2d3, #5f27cd
  );
}

@keyframes confetti {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>