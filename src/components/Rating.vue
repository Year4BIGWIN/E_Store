<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  initialRating: {
    type: Number,
    default: 0
  },
  initialReview: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showTextArea: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:rating', 'update:review']);
const hoverRating = ref(0);
const selectedRating = ref(props.initialRating);
const reviewText = ref(props.initialReview);

const setHoverRating = (rating) => {
  if (props.readonly) return;
  hoverRating.value = rating;
};

const resetHoverRating = () => {
  if (props.readonly) return;
  hoverRating.value = 0;
};

const setRating = (rating) => {
  if (props.readonly) return;
  selectedRating.value = rating;
  emit('update:rating', rating);
};

const updateReview = (event) => {
  reviewText.value = event.target.value;
  emit('update:review', reviewText.value);
};

const getStarClass = (position) => {
  const rating = hoverRating.value || selectedRating.value;
  return {
    'text-yellow-400': position <= rating,
    'text-gray-300': position > rating,
    'cursor-pointer': !props.readonly,
    'hover:scale-110 transition-transform': !props.readonly
  };
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <div 
      class="flex items-center gap-1" 
      @mouseleave="resetHoverRating"
    >
      <div 
        v-for="position in 5" 
        :key="position"
        @mouseover="setHoverRating(position)"
        @click="setRating(position)"
        class="text-lg"
      >
        <i class="fa-solid fa-star" :class="getStarClass(position)"></i>
      </div>
      <span v-if="selectedRating > 0" class="text-sm text-gray-600 ml-2">
        {{ selectedRating }}/5
      </span>
    </div>
    
    <!-- Review text area -->
    <textarea 
      v-if="showTextArea && !readonly"
      v-model="reviewText"
      @input="updateReview"
      rows="3"
      placeholder="Write your review here..."
      class="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      :disabled="readonly"
    ></textarea>
    
    <!-- Display review text when in readonly mode -->
    <p v-if="showTextArea && readonly && reviewText" class="text-gray-700 italic">
      "{{ reviewText }}"
    </p>
  </div>
</template>