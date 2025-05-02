<script setup>
defineProps({
  showButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click']);
</script>

<template>
  <button 
    v-if="showButton"
    @click="emit('click')" 
    class="hover:brightness-90 text-white bg-black py-1 px-3 border-2 rounded-xl"
  >
    Checkout
  </button>
</template>