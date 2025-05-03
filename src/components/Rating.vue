<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

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

const getStarFillPercentage = (position) => {
  const rating = hoverRating.value || selectedRating.value;
  if (position <= Math.floor(rating)) {
    return 100; // Full star
  } else if (position > Math.ceil(rating)) {
    return 0; // Empty star
  } else {
    // Partial star - calculate percentage
    const decimal = rating - Math.floor(rating);
    return Math.round(decimal * 100);
  }
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
        class="relative"
        style="width: 16px; height: 16px;" 
      >
        <!-- SVG Star with precise fill level -->
        <svg viewBox="0 0 24 24" class="w-full h-full">
          <!-- Background/empty star -->
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="#e2e8f0" 
          />
          <!-- Filled portion -->
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            :style="{
              fill: '#facc15',
              clipPath: `inset(0 ${100 - getStarFillPercentage(position)}% 0 0)`
            }"
          />
        </svg>
      </div>
      
      <!-- Display numerical rating -->
      <span class="text-xs ml-2 text-gray-600" v-if="props.readonly">
        {{ selectedRating.toFixed(1) }}
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