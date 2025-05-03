<template>
  <div class="flex justify-center items-center">
    <div
      v-for="n in 4"
      :key="n"
      class="relative w-5 h-5 mx-2 rounded-full border-2 border-gray-700 animate-circle"
      :style="{ animationDelay: `${(n - 1) * 0.3}s` }"
    >
      <div
        class="absolute inset-0 m-auto w-4 h-4 rounded-full bg-gray-700 animate-dot"
        :style="{ animationDelay: `${(n - 1) * 0.3}s` }"
      ></div>
      <div
        class="absolute inset-0 m-auto w-5 h-5 rounded-full animate-outline"
        :style="{ animationDelay: `${(n - 1) * 0.3 + 0.9}s` }"
      ></div>
    </div>
  </div>
</template>
  
<style scoped>
@keyframes circle-keys {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
  
@keyframes dot-keys {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
  
@keyframes outline-keys {
  0% {
    transform: scale(0);
    outline: solid 20px hsl(0, 0%, 33%);
    outline-offset: 0;
    opacity: 1;
  }
  100% {
    transform: scale(1);
    outline: solid 0 transparent;
    outline-offset: 20px;
    opacity: 0;
  }
}
  
.animate-circle {
  animation: circle-keys 2s ease-in-out infinite;
}
  
.animate-dot {
  animation: dot-keys 2s ease-in-out infinite;
}
  
.animate-outline {
  animation: outline-keys 2s ease-in-out infinite;
}
</style>
