<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Cookies from "universal-cookie";
import { useCartStore } from "@/store/cartStore";
import Checkout from "@/components/CheckOut/Checkout.vue";
import StarRating from "@/components/Rating.vue";
import SpectComponent from "@/components/SpectComponent.vue";
import ProductGallery from "@/components/ProductDetail/ProductGallery.vue";
import ProductSpecifications from "@/components/ProductDetail/ProductSpecifications.vue";
import ReviewSection from "@/components/ProductDetail/ReviewSection.vue";
import Loader from "@/components/Loader.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const route = useRoute();
const router = useRouter(); // Add this line
const product = ref({});
const error = ref(null);
const isLoading = ref(true);
const isBuyingNow = ref(false); // Added loading state for buy now
const quantity = ref(1);
const cartStore = useCartStore();

// Reference to the checkout component
const checkoutRef = ref(null);

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
    if (
      product.value.data?.imageUrls &&
      product.value.data.imageUrls.length > 0
    ) {
      // Product Gallery component will handle image display
    } else if (product.value.data?.image_url) {
      // Create imageUrls array if only single image_url is available
      product.value.data.imageUrls = [product.value.data.image_url];
    } else {
      // Set default empty array if no images
      product.value.data.imageUrls = [];
    }

    console.log("Product data:", product.value);
  } catch (err) {
    console.error("API Error:", err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

const addToCart = async (phoneId, quantity) => {
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Check if user is authenticated
    if (!token) {
      router.push({ 
        name: "login", 
        query: { redirect: route.fullPath } 
      });
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

    // Fetch updated cart after adding an item
    await cartStore.fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("An error occurred while adding the item. Please try again.");
  }
};

const buyNow = async (phoneId, quantity = 1) => {
  try {
    isBuyingNow.value = true;

    // Check if user is authenticated
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    if (!token) {
      router.push({ 
        name: "login", 
        query: { redirect: route.fullPath } 
      });
      return;
    }

    // First add the item to cart
    await addToCart(phoneId, quantity);

    // Fetch the entire cart instead of just the one item
    await cartStore.fetchCart();

    // Add a small delay to ensure component is ready
    setTimeout(() => {
      // Open checkout dialog directly
      if (checkoutRef.value) {
        checkoutRef.value.openCheckout();
      } else {
        console.error("Checkout reference not found");
      }
    }, 100);
  } catch (error) {
    console.error("Error in buy now:", error);
  } finally {
    isBuyingNow.value = false;
  }
};

const handleCheckoutSuccess = () => {
  cartStore.fetchCart();
};

const updateQuantity = (operation) => {
  if (operation === "increment") quantity.value += 1;
  else if (operation === "decrement" && quantity.value > 1) quantity.value -= 1;
};

const handleReviewSubmitted = () => {
  fetchProduct(route.params.id);
};

onMounted(() => {
  if (route.params.id) fetchProduct(route.params.id);
});
</script>

<template>
  <div
    class="max-w-6xl w-full mx-auto px-4 md:px-6 flex flex-col gap-6 md:gap-10 py-6 md:py-10"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-10 md:py-20"
    >
      <Loader />
      <p class="text-gray-500 mt-4">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center py-10 md:py-20">
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else class="w-full flex flex-col gap-4">
      <!-- Breadcrumbs - scrollable on mobile -->
      <div class="w-full overflow-x-auto pb-2 md:pb-0">
        <div
          class="flex gap-4 font-semibold text-sm md:text-lg whitespace-nowrap"
        >
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
        <!-- Product Images - Now using the ProductGallery component -->
        <ProductGallery :images="product.data.imageUrls" />

        <!-- Product Info -->
        <div class="w-full md:w-full flex flex-col gap-4 md:gap-6 md:pl-6 pl-0">
          <div>
            <span
              class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-2"
            >
              {{ product.data.productType.name }}
            </span>
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ product.data.model || "Product Title" }}
            </h1>
          </div>

          <!-- Average Rating Display -->
          <div class="flex flex-wrap items-center gap-2">
            <StarRating
              :initialRating="product.data?.averageRating || 0"
              :readonly="true"
              class="flex-shrink-0"
            />
            <span class="text-xs md:text-sm text-gray-600 mt-1 md:mt-0">
              ({{ product.data?.averageRating || 0 }}/5 -
              {{ product.data?.reviews.length || 0 }} reviews)
            </span>
          </div>

          <div v-if="product.data?.productType?.name !== 'Accessory'">
            <SpectComponent :product="product.data" />
          </div>

          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h2 class="text-xl md:text-2xl font-bold text-blue-600">
              ${{ product.data.price?.toLocaleString() || "0.00" }}
            </h2>
            <p class="text-xs md:text-sm text-gray-500 mt-1">
              Free shipping & 30-day returns
            </p>
          </div>

          <hr class="border-gray-200" />

          <!-- Product Variations -->
          <div v-if="product.variants" class="flex flex-col gap-3 md:gap-4">
            <div v-for="(variant, name) in product.variants" :key="name">
              <h3 class="text-sm md:text-md font-semibold mb-2">
                Choose {{ name }}
              </h3>
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
              <span class="px-3 md:px-4 py-1 md:py-2 border-x">{{
                quantity
              }}</span>
              <button
                class="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 transition-colors"
                @click="updateQuantity('increment')"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
            <div
              class="text-xs md:text-sm text-gray-500 w-full md:w-auto mt-1 md:mt-0"
            >
              <span v-if="product.data.stock > 10">{{ product.data.stock }} In Stock</span>
              <span v-else-if="product.data.stock > 0" class="text-orange-500"
                >Only {{ product.data.stock }} left</span
              >
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
              @click="buyNow(product.data.id, quantity)"
              :disabled="isBuyingNow"
              class="w-full py-2 md:py-3 px-4 md:px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <i class="fa-solid fa-spinner fa-spin" v-if="isBuyingNow"></i>
              <i class="fa-solid fa-bolt" v-else></i>
              {{ isBuyingNow ? "Processing..." : "Buy Now" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Specifications - Using the ProductSpecifications component -->
    <ProductSpecifications
      v-if="!isLoading && !error"
      :product="product.data"
    />

    <!-- Customer Reviews - Using the ReviewSection component -->
    <ReviewSection
      v-if="!isLoading && !error"
      :productId="product.data?.id"
      :reviews="product.data?.reviews || []"
      :apiUrl="apiUrl"
      :onReviewSubmitted="handleReviewSubmitted"
    />

    <!-- Add the Checkout component at the end of the template -->
    <Checkout
      ref="checkoutRef"
      :cartItems="cartStore.cartItems"
      :totalPrice="cartStore.totalPrice"
      :showButton="false"
      @payment-successful="handleCheckoutSuccess"
      @update-cart="handleCheckoutSuccess"
    />
  </div>
</template>
