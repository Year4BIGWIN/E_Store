<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Cookies from "universal-cookie";
import DropDown from "@/components/DropDown.vue";
import { useCartStore } from "@/store/cartStore";
import Checkout from "@/components/CheckOut/Checkout.vue";
import StarRating from "@/components/Rating.vue"; // Import the new component

const apiUrl = import.meta.env.VITE_APP_API_URL;
const route = useRoute();
const product = ref({});
const error = ref(null);
const isLoading = ref(true);
const quantity = ref(1);
const cartStore = useCartStore();

// Updated review object - now includes both rating and text review
const review = ref({
  review: "",
  rating: 0,
  productId: route.params.id,
});

// Review submission status
const reviewStatus = ref({
  show: false,
  type: 'success',
  message: ''
});

// Reference to the checkout component
const checkoutRef = ref(null);
// Single item cart for direct checkout
const singleItemCart = ref([]);
const singleItemTotal = ref(0);

// Image navigation and selection
const currentImageIndex = ref(0);
const selectedImage = ref(null);

const selectImage = (index) => {
  currentImageIndex.value = index;
  selectedImage.value = product.value.data.imageUrls[index];
};

const navigateImage = (direction) => {
  const imagesLength = product.value.data.imageUrls.length;
  if (direction === 'next') {
    currentImageIndex.value = (currentImageIndex.value + 1) % imagesLength;
  } else {
    currentImageIndex.value = currentImageIndex.value === 0 ? imagesLength - 1 : currentImageIndex.value - 1;
  }
  selectedImage.value = product.value.data.imageUrls[currentImageIndex.value];
};

const openLightbox = (imageUrl) => {
  if (!imageUrl) return;
  window.open(imageUrl, '_blank');
};

const updateReviewProductId = () => {
  if (product.value?.data?.id) {
    review.value.productId = product.value.data.id;
  }
};

const fetchProduct = async (id) => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${apiUrl}/product/${id}`);
    product.value = data || {};
    
    // Make sure rating is accessible from the correct path
    if (!product.value.data.rating && product.value.rating) {
      product.value.data.rating = product.value.rating;
    }
    
    // Check if imageUrls exists and initialize selected image
    if (product.value.data?.imageUrls && product.value.data.imageUrls.length > 0) {
      selectedImage.value = product.value.data.imageUrls[0];
      currentImageIndex.value = 0;
    } else if (product.value.data?.image_url) {
      // Create imageUrls array if only single image_url is available
      product.value.data.imageUrls = [product.value.data.image_url];
      selectedImage.value = product.value.data.image_url;
      currentImageIndex.value = 0;
    } else {
      // Set default empty array if no images
      product.value.data.imageUrls = [];
    }
    
    updateReviewProductId();
    
    console.log("Product data:", product.value);
  } catch (err) {
    console.error("API Error:", err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

const submitRating = async () => {
  if (review.value.rating === 0) {
    reviewStatus.value = {
      show: true,
      type: 'error',
      message: 'Please select a rating'
    };
    setTimeout(() => {
      reviewStatus.value.show = false;
    }, 3000);
    return;
  }

  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Validate token
    if (!token || token.split(".").length !== 3) {
      reviewStatus.value = {
        show: true,
        type: 'error',
        message: 'Please log in to submit a review'
      };
      setTimeout(() => {
        reviewStatus.value.show = false;
      }, 3000);
      return;
    }

    const response = await fetch(`${apiUrl}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: review.value.productId,
        rating: review.value.rating,
        review: review.value.review || "" // Ensure empty string if null
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      reviewStatus.value = {
        show: true,
        type: 'error',
        message: responseData.message || 'Failed to submit review'
      };
    } else {
      // Clear the form data first
      const productId = review.value.productId; // Save the product ID
      
      // Reset form completely by replacing the object
      review.value = {
        review: "",
        rating: 0,
        productId // Restore the product ID
      };
      
      reviewStatus.value = {
        show: true,
        type: 'success',
        message: 'Review submitted successfully!'
      };
      
      // Refresh product to show updated reviews
      fetchProduct(route.params.id);
    }
    
    setTimeout(() => {
      reviewStatus.value.show = false;
    }, 3000);
  } catch (error) {
    console.error("Error submitting review:", error);
    reviewStatus.value = {
      show: true,
      type: 'error',
      message: 'An error occurred while submitting your review'
    };
    setTimeout(() => {
      reviewStatus.value.show = false;
    }, 3000);
  }
};

const addToCart = async (phoneId, quantity) => {
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Validate token
    if (!token || token.split(".").length !== 3) {
      alert("Invalid or missing authentication token");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneId, quantity }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      alert(responseData.message || "Failed to add item to cart");
      return;
    }

    console.log("Add to cart response:", responseData);

    // Fetch updated cart after adding an item
    await cartStore.fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("An error occurred while adding the item. Please try again.");
  }
};

const buyNow = async () => {
  try {
    // First add the item to cart
    await addToCart(product.value.data.id, quantity.value);

    // Fetch the entire cart
    await cartStore.fetchCart();

    // Use the entire cart for checkout
    if (cartStore.cartItems.length > 0) {
      singleItemCart.value = cartStore.cartItems;

      // Calculate total for all items in cart
      singleItemTotal.value = cartStore.cartItems.reduce(
        (total, item) => total + item.phone.price * item.quantity,
        0
      );

      // Add a small delay to ensure component is ready
      setTimeout(() => {
        // Open checkout dialog directly
        if (checkoutRef.value) {
          checkoutRef.value.openCheckout();
        } else {
          console.error("Checkout reference not found");
        }
      }, 100);
    }
  } catch (error) {
    console.error("Error in buy now:", error);
    alert("An error occurred while processing. Please try again.");
  }
};

const handleCheckoutSuccess = () => {
  // Refresh cart after successful checkout
  cartStore.fetchCart();
};

const updateQuantity = (operation) => {
  if (operation === "increment") quantity.value += 1;
  else if (operation === "decrement" && quantity.value > 1) quantity.value -= 1;
};

const extractDetails = (category) => {
  return computed(() => {
    return Object.entries(product.value?.data?.[category] || {})
      .map(([label, value]) => ({ label, value }))
      .filter((detail) => detail.value);
  });
};

const displayDetails = extractDetails("display");
const performanceDetails = extractDetails("performance");
const cameraDetails = extractDetails("camera");
const batteryDetails = extractDetails("battery");
const connectivityDetails = extractDetails("connectivity");
const buildDetails = extractDetails("build");
const otherFeatures = extractDetails("otherFeatures");
const softwareFeatures = extractDetails("softwareFeatures");
const additionalDetails = extractDetails("additionalInfo");

onMounted(() => {
  if (route.params.id) fetchProduct(route.params.id);
});
</script>

<template>
  <div class="max-w-6xl w-full mx-auto px-4 md:px-6 flex flex-col gap-6 md:gap-10 py-6 md:py-10">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10 md:py-20">
      <p class="text-gray-500">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center py-10 md:py-20">
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else class="w-full flex flex-col gap-4">
      <!-- Breadcrumbs - scrollable on mobile -->
      <div class="w-full overflow-x-auto pb-2 md:pb-0">
        <div class="flex gap-4 font-semibold text-sm md:text-lg whitespace-nowrap">
          <router-link to="/">
            <span class="hover:text-blue-500">Home</span>
          </router-link>
          <router-link to="/products">
            &#x2022;
            <span class="hover:text-blue-500">Product</span>
          </router-link>
          <router-link to="/categories">
            &#x2022;
            <span class="hover:text-blue-500">
              {{ product.data.productType.name }}
            </span>
          </router-link>
        </div>
      </div>
      
      <!-- Product layout - stack on mobile, side by side on desktop -->
      <div class="w-full flex flex-col md:flex-row gap-6 md:gap-4">
        <!-- Product Images -->
        <div class="w-full md:w-full flex flex-col gap-4">
          <!-- Main image display -->
          <div class="w-full relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
            <img 
              :src="selectedImage || (product.data.imageUrls && product.data.imageUrls[0])" 
              alt="Selected Image"
              class="w-full h-[350px] md:h-[500px] object-contain p-4"
              @error="(e) => (e.target.src = '/placeholder-image.jpg')"
            />
            
            <!-- Image magnification overlay -->
            <div @click="openLightbox(selectedImage)" class="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-colors">
              <i class="fa-solid fa-expand"></i>
            </div>
            
            <!-- Navigation arrows -->
            <div v-if="product.data.imageUrls && product.data.imageUrls.length > 1" class="absolute inset-y-0 left-0 flex items-center">
              <button 
                class="bg-white/60 hover:bg-white text-gray-800 h-8 w-8 md:h-10 md:w-10 rounded-r-lg flex items-center justify-center shadow-sm -ml-2 transition-all group-hover:ml-2"
                @click="navigateImage('prev')"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>
            </div>
            
            <div v-if="product.data.imageUrls && product.data.imageUrls.length > 1" class="absolute inset-y-0 right-0 flex items-center">
              <button 
                class="bg-white/60 hover:bg-white text-gray-800 h-8 w-8 md:h-10 md:w-10 rounded-l-lg flex items-center justify-center shadow-sm -mr-2 transition-all group-hover:mr-2"
                @click="navigateImage('next')"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            
            <!-- Image counter pill -->
            <div v-if="product.data.imageUrls && product.data.imageUrls.length > 1" class="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {{ currentImageIndex + 1 }} / {{ product.data.imageUrls.length }}
            </div>
          </div>
          
          <!-- Empty state when no images -->
          <div v-if="!product.data.imageUrls || product.data.imageUrls.length === 0" class="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <i class="fa-regular fa-image text-3xl md:text-4xl text-gray-400 mb-2"></i>
            <p class="text-gray-500">No images available</p>
          </div>
          
          <!-- Thumbnails row -->
          <div v-if="product.data.imageUrls && product.data.imageUrls.length > 0" class="flex gap-2 w-full overflow-x-auto pb-2">
            <div 
              v-for="(img, index) in product.data.imageUrls" 
              :key="`thumb-${index}`" 
              class="relative shrink-0 cursor-pointer transition-all duration-200"
              :class="[currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-80 hover:opacity-100']"
              @click="selectImage(index)"
            >
              <img 
                :src="img" 
                alt="Thumbnail"
                class="w-14 h-14 md:w-16 md:h-16 object-cover rounded-md bg-white"
              />
            </div>
          </div>
          
          <!-- Image count indicator -->
          <p v-if="product.data.imageUrls && product.data.imageUrls.length > 0" class="text-xs md:text-sm text-gray-500 text-center">
            {{ product.data.imageUrls.length }} {{ product.data.imageUrls.length === 1 ? 'image' : 'images' }} available
          </p>
        </div>

        <!-- Product Info -->
        <div class="w-full md:w-full flex flex-col gap-4 md:gap-6 md:pl-6 pl-0">
          <div>
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-2">
              {{ product.data.productType.name }}
            </span>
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ product.data.model || "Product Title" }}
            </h1>
          </div>
          
          <!-- Average Rating Display -->
          <div class="flex flex-wrap items-center gap-2">
            <StarRating :initialRating="product.data?.averageRating || 0" :readonly="true" class="flex-shrink-0" />
            <span class="text-xs md:text-sm text-gray-600 mt-1 md:mt-0">
              ({{ product.data?.averageRating || 0 }}/5 - {{ product.data?.reviews.length || 0 }} reviews)
            </span>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h2 class="text-xl md:text-2xl font-bold text-blue-600">
              ${{ product.data.price?.toLocaleString() || "0.00" }}
            </h2>
            <p class="text-xs md:text-sm text-gray-500 mt-1">Free shipping & 30-day returns</p>
          </div>
          
          <hr class="border-gray-200" />

          <!-- Product Variations -->
          <div v-if="product.variants" class="flex flex-col gap-3 md:gap-4">
            <div v-for="(variant, name) in product.variants" :key="name">
              <h3 class="text-sm md:text-md font-semibold mb-2">Choose {{ name }}</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in variant"
                  :key="option"
                  class="px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
            <h3 class="font-medium text-sm md:text-base">Quantity:</h3>
            <div class="flex items-center border rounded-lg overflow-hidden">
              <button
                class="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 transition-colors"
                @click="updateQuantity('decrement')"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="px-3 md:px-4 py-1 md:py-2 border-x">{{ quantity }}</span>
              <button
                class="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 transition-colors"
                @click="updateQuantity('increment')"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
            <div class="text-xs md:text-sm text-gray-500 w-full md:w-auto mt-1 md:mt-0">
              <span v-if="product.data.stock > 10">In Stock</span>
              <span v-else-if="product.data.stock > 0" class="text-orange-500">Only {{ product.data.stock }} left</span>
              <span v-else class="text-red-500">Out of Stock</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="w-full flex flex-col sm:flex-row items-center gap-3 mt-2">
            <button
              @click="addToCart(product.data.id, quantity)"
              class="w-full py-2 md:py-3 px-4 md:px-6 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <button 
              @click="buyNow" 
              class="w-full py-2 md:py-3 px-4 md:px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <i class="fa-solid fa-bolt"></i> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Product Specifications -->
    <div class="w-full flex flex-col gap-6 mt-8">
      <h1 class="font-semibold text-2xl border-b pb-3">Product Specifications</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="flex flex-col gap-3">

          <!-- Additional Details -->
          <DropDown 
            v-if="additionalDetails.length" 
            class="w-full shadow-sm" 
            title="Discription" 
            icon="fa-solid fa-info-circle"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in additionalDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Display Details -->
          <DropDown 
            v-if="displayDetails.length" 
            class="w-full shadow-sm" 
            title="Display" 
            icon="fa-solid fa-tv"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in displayDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Performance Details -->
          <DropDown 
            v-if="performanceDetails.length" 
            class="w-full shadow-sm" 
            title="Performance" 
            icon="fa-solid fa-microchip"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in performanceDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Camera Details -->
          <DropDown 
            v-if="cameraDetails.length" 
            class="w-full shadow-sm" 
            title="Camera" 
            icon="fa-solid fa-camera"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in cameraDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Battery Details -->
          <DropDown 
            v-if="batteryDetails.length" 
            class="w-full shadow-sm" 
            title="Battery" 
            icon="fa-solid fa-battery-full"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in batteryDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-3">
          <!-- Connectivity Details -->
          <DropDown 
            v-if="connectivityDetails.length" 
            class="w-full shadow-sm" 
            title="Connectivity" 
            icon="fa-solid fa-wifi"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in connectivityDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Build Details -->
          <DropDown 
            v-if="buildDetails.length" 
            class="w-full shadow-sm" 
            title="Build & Design" 
            icon="fa-solid fa-pencil-ruler"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in buildDetails"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Other Features -->
          <DropDown 
            v-if="otherFeatures.length" 
            class="w-full shadow-sm" 
            title="Other Features" 
            icon="fa-solid fa-star"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in otherFeatures"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>

          <!-- Software Features -->
          <DropDown 
            v-if="softwareFeatures.length" 
            class="w-full shadow-sm" 
            title="Software Features" 
            icon="fa-solid fa-code"
          >
            <ul class="divide-y divide-gray-100">
              <li
                v-for="(detail, index) in softwareFeatures"
                :key="index"
                class="py-3 flex flex-wrap items-start"
              >
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>
        </div>
      </div>
    </div>

    <!-- Customer Reviews -->
    <div class="w-full flex flex-col gap-6 mt-8">
      <h1 class="font-semibold text-2xl border-b pb-3">Customer Reviews</h1>
      
      <!-- Submit a review -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div v-if="reviewStatus.show" 
             :class="[
               'mb-4 p-3 rounded-md',
               reviewStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
             ]">
          {{ reviewStatus.message }}
        </div>
        
        <h3 class="text-lg font-medium mb-3">Write a Review</h3>
        
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-3">
            <label class="text-sm font-medium text-gray-700">Your Rating</label>
            <StarRating 
              :initialRating="review.rating"
              @update:rating="(val) => review.rating = val" 
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
          
          <button 
            @click="submitRating" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
          >
            Submit Review
          </button>
        </div>
      </div>
      
      <!-- Display existing reviews -->
      <div class="mt-6">
        <h3 class="font-medium text-lg mb-4">{{ product.data?.reviews?.length || 0 }} Reviews</h3>
        
        <div v-if="product.data?.reviews?.length > 0" class="space-y-6">
          <div v-for="(item, idx) in product.data.reviews" :key="idx" class="bg-white p-4 rounded-lg shadow-sm">
            <div class="flex items-start justify-between">
              <div>
                  <StarRating :initialRating="item.rating" :readonly="true" />
        
                <p class="text-sm font-medium text-gray-800 mt-1">
                   Anonymous
                </p>
              </div>
              
              <p class="text-xs text-gray-500">
                {{ new Date(item.createdAt).toLocaleDateString() }}
              </p>
            </div>
            
            <p v-if="item.review" class="mt-3 text-gray-700">
              {{ item.review }}
            </p>
            <p v-else class="mt-3 text-gray-500 italic text-sm">
              No written review provided.
            </p>
          </div>
        </div>
        
        <div v-else class="bg-gray-50 p-6 text-center rounded-lg">
          <p class="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    </div>

    <!-- Add the Checkout component at the end of the template -->
    <Checkout
      ref="checkoutRef"
      :cartItems="singleItemCart"
      :totalPrice="singleItemTotal"
      :showButton="false"
      @payment-successful="handleCheckoutSuccess"
      @update-cart="handleCheckoutSuccess"
    />
</template>
