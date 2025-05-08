<script setup>
import { ref } from "vue";
import StarRating from "@/components/Rating.vue";
import Cookies from "universal-cookie";
import avatar from "@/assets/image/avatar.webp";
import Loader from "@/components/Loader.vue"; // Import Loader component

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true,
  },
  reviews: {
    type: Array,
    default: () => [],
  },
  apiUrl: {
    type: String,
    required: true,
  },
  onReviewSubmitted: {
    type: Function,
    default: () => {},
  },
});

const review = ref({
  review: "",
  rating: 0,
  productId: props.productId,
});

const reviewStatus = ref({
  show: false,
  type: "success",
  message: "",
});

const isSubmitting = ref(false); // Add loading state

const submitRating = async () => {
  if (review.value.rating === 0) {
    reviewStatus.value = {
      show: true,
      type: "error",
      message: "Please select a rating",
    };
    setTimeout(() => {
      reviewStatus.value.show = false;
    }, 3000);
    return;
  }

  isSubmitting.value = true; // Set loading state to true

  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Validate token
    if (!token || token.split(".").length !== 3) {
      reviewStatus.value = {
        show: true,
        type: "error",
        message: "Please log in to submit a review",
      };
      setTimeout(() => {
        reviewStatus.value.show = false;
      }, 3000);
      return;
    }

    const response = await fetch(`${props.apiUrl}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: review.value.productId,
        rating: review.value.rating,
        review: review.value.review || "",
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      reviewStatus.value = {
        show: true,
        type: "error",
        message: responseData.message || "Failed to submit review",
      };
    } else {
      // Clear the form data first
      const productId = review.value.productId; // Save the product ID

      // Reset form completely by replacing the object
      review.value = {
        review: "",
        rating: 0,
        productId, // Restore the product ID
      };

      reviewStatus.value = {
        show: true,
        type: "success",
        message: "Review submitted successfully!",
      };

      // Notify parent component
      props.onReviewSubmitted();
    }

    setTimeout(() => {
      reviewStatus.value.show = false;
    }, 3000);
  } catch (error) {
    console.error("Error submitting review:", error);
    reviewStatus.value = {
      show: true,
      type: "error",
      message: "An error occurred while submitting your review",
    };
    setTimeout(() => {
      reviewStatus.value.show = false;
    }, 3000);
  } finally {
    isSubmitting.value = false; // Set loading state to false
  }
};
</script>

<template>
  <div class="w-full flex flex-col gap-6 mt-8">
    <h1 class="font-semibold text-2xl border-b pb-3">Customer Reviews</h1>

    <!-- Submit a review -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div
        v-if="reviewStatus.show"
        :class="[
          'mb-4 p-3 rounded-md',
          reviewStatus.type === 'success'
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800',
        ]"
      >
        {{ reviewStatus.message }}
      </div>

      <h3 class="text-lg font-medium mb-3">Write a Review</h3>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3">
          <label class="text-sm font-medium text-gray-700">Your Rating</label>
          <StarRating
            :initialRating="review.rating"
            @update:rating="(val) => (review.rating = val)"
            :showTextArea="false"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Your Review</label>
          <textarea
            v-model="review.review"
            rows="4"
            placeholder="Share your experience with this product..."
            class="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        <div v-if="isSubmitting" class="my-4">
          <Loader />
        </div>

        <button
          @click="submitRating"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
          :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </div>

    <!-- Display existing reviews -->
    <div class="mt-6">
      <h3 class="font-medium text-lg mb-4">
        {{ reviews.length || 0 }} Reviews
      </h3>

      <div v-if="reviews.length > 0" class="space-y-6">
        <div
          v-for="(item, idx) in reviews"
          :key="idx"
          class="bg-white p-4 rounded-lg shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <img
                :src="item.userImageUrl || avatar"
                alt="User Image"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <StarRating :initialRating="item.rating" :readonly="true" />
                <p class="text-sm font-medium text-gray-800 mt-1">
                  {{ item.username }}
                </p>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              {{ new Date(item.createdAt).toLocaleDateString() }}
            </p>
          </div>

          <p v-if="item.review" class="mt-3 text-gray-700">{{ item.review }}</p>
          <p v-else class="mt-3 text-gray-500 italic text-sm">
            No written review provided.
          </p>
        </div>
      </div>

      <div v-else class="bg-gray-50 p-6 text-center rounded-lg">
        <p class="text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    </div>
  </div>
</template>
