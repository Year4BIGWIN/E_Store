<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Cookies from "universal-cookie";
import Buttom from "@/components/Buttom.vue";
import ProductCard from "@/components/ProductCard.vue";
import DropDown from "@/components/DropDown.vue";
import { useCartStore } from "@/store/cartStore";
import Checkout from "@/components/Checkout.vue"; // Import Checkout component

const apiUrl = import.meta.env.VITE_APP_API_URL;
const route = useRoute();
const product = ref({});
const error = ref(null);
const isLoading = ref(true);
const similarProducts = ref([]);
const quantity = ref(1);
const cartStore = useCartStore();

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

const fetchProduct = async (id) => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${apiUrl}/product/${id}`);
    product.value = data || {};
    
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

onMounted(() => {
  if (route.params.id) fetchProduct(route.params.id);
});
</script>

<template>
  <div class="w-[1152px] justify-start flex flex-col gap-10 py-10">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-20">
      <p class="text-gray-500">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center py-20">
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else class="w-full flex flex-col gap-4">
      <div class="w-full flex gap-4 font-semibold text-lg">
        <router-link to="/"
          ><span class="hover:text-blue-500">Home</span></router-link
        >
        <router-link to="/products"
          >&#x2022;
          <span class="hover:text-blue-500">Product</span></router-link
        >
        <router-link to="/categories">
          &#x2022;
          <span class="hover:text-blue-500">
            {{ product.data.productType.name }}
          </span>
        </router-link>
      </div>
      <div class="w-full flex gap-4">
        <!-- Product Images -->
        <div class="w-1/2 flex flex-col gap-4">
          <!-- Main image display -->
          <div class="w-full relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
            <img 
              :src="selectedImage || (product.data.imageUrls && product.data.imageUrls[0])" 
              alt="Selected Image"
              class="w-full h-[500px] object-contain p-4"
              @error="(e) => (e.target.src = '/placeholder-image.jpg')"
            />
            
            <!-- Image magnification overlay -->
            <div @click="openLightbox(selectedImage)" class="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-colors">
              <i class="fa-solid fa-expand"></i>
            </div>
            
            <!-- Navigation arrows -->
            <div v-if="product.data.imageUrls && product.data.imageUrls.length > 1" class="absolute inset-y-0 left-0 flex items-center">
              <button 
                class="bg-white/60 hover:bg-white text-gray-800 h-10 w-10 rounded-r-lg flex items-center justify-center shadow-sm -ml-2 transition-all group-hover:ml-2"
                @click="navigateImage('prev')"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>
            </div>
            
            <div v-if="product.data.imageUrls && product.data.imageUrls.length > 1" class="absolute inset-y-0 right-0 flex items-center">
              <button 
                class="bg-white/60 hover:bg-white text-gray-800 h-10 w-10 rounded-l-lg flex items-center justify-center shadow-sm -mr-2 transition-all group-hover:mr-2"
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
          <div v-if="!product.data.imageUrls || product.data.imageUrls.length === 0" class="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <i class="fa-regular fa-image text-4xl text-gray-400 mb-2"></i>
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
                class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md bg-white"
              />
            </div>
          </div>
          
          <!-- Image count indicator -->
          <p v-if="product.data.imageUrls && product.data.imageUrls.length > 0" class="text-sm text-gray-500 text-center">
            {{ product.data.imageUrls.length }} {{ product.data.imageUrls.length === 1 ? 'image' : 'images' }} available
          </p>
        </div>

        <!-- Product Info -->
        <div class="w-1/2 flex flex-col gap-6 pl-6">
          <div>
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-2">
              {{ product.data.productType.name }}
            </span>
            <h1 class="text-3xl font-bold">
              {{ product.data.model || "Product Title" }}
            </h1>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="flex">
              <i
                v-for="star in 5"
                :key="star"
                class="fa-solid fa-star text-lg"
                :class="star <= product.rating ? 'text-yellow-400' : 'text-gray-200'"
              ></i>
            </div>
            <span class="text-sm text-gray-600">({{ product.rating || 0 }}/5)</span>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h2 class="text-2xl font-bold text-blue-600">
              ${{ product.data.price?.toLocaleString() || "0.00" }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">Free shipping & 30-day returns</p>
          </div>
          
          <hr class="border-gray-200" />

          <!-- Product Variations -->
          <div v-if="product.variants" class="flex flex-col gap-4">
            <div v-for="(variant, name) in product.variants" :key="name">
              <h3 class="text-md font-semibold mb-2">Choose {{ name }}</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in variant"
                  :key="option"
                  class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 mt-2">
            <h3 class="font-medium">Quantity:</h3>
            <div class="flex items-center border rounded-lg overflow-hidden">
              <button
                class="px-3 py-2 hover:bg-gray-100 transition-colors"
                @click="updateQuantity('decrement')"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="px-4 py-2 border-x">{{ quantity }}</span>
              <button
                class="px-3 py-2 hover:bg-gray-100 transition-colors"
                @click="updateQuantity('increment')"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
            <div class="text-sm text-gray-500">
              <span v-if="product.data.stock > 10">In Stock</span>
              <span v-else-if="product.data.stock > 0" class="text-orange-500">Only {{ product.data.stock }} left</span>
              <span v-else class="text-red-500">Out of Stock</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="w-full flex items-center gap-3 mt-2">
            <button
              @click="addToCart(product.data.id, quantity)"
              class="w-full py-3 px-6 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <button 
              @click="buyNow" 
              class="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-bolt"></i> Buy Now
            </button>
          </div>
          
          <div class="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <button class="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <i class="fa-regular fa-heart"></i> Add to Wishlist
            </button>
            <span>•</span>
            <button class="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <i class="fa-solid fa-share-nodes"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Specifications -->
    <div class="w-full flex flex-col gap-4">
    <h1 class="font-semibold text-2xl">Product Specifications</h1>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-2 bg-gray-50 flex flex-col rounded-lg">
        <!-- Display Details -->
        <DropDown v-if="displayDetails.length" class="w-full" title="Display">
          <ul>
            <li
              v-for="(detail, index) in displayDetails"
              :key="index"
              class="w-full flex py-2"
            >
              <span class="w-1/4">{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Performance Details -->
        <DropDown v-if="performanceDetails.length" class="w-full" title="Performance">
          <ul>
            <li
              v-for="(detail, index) in performanceDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Camera Details -->
        <DropDown v-if="cameraDetails.length" class="w-full" title="Camera">
          <ul>
            <li
              v-for="(detail, index) in cameraDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Battery Details -->
        <DropDown v-if="batteryDetails.length" class="w-full" title="Battery">
          <ul>
            <li
              v-for="(detail, index) in batteryDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Connectivity Details -->
        <DropDown v-if="connectivityDetails.length" class="w-full" title="Connectivity">
          <ul>
            <li
              v-for="(detail, index) in connectivityDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Build Details -->
        <DropDown v-if="buildDetails.length" class="w-full" title="Build & Design">
          <ul>
            <li
              v-for="(detail, index) in buildDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Other Features -->
        <DropDown v-if="otherFeatures.length" class="w-full" title="Other Features">
          <ul>
            <li
              v-for="(detail, index) in otherFeatures"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>

        <!-- Software Features -->
        <DropDown v-if="softwareFeatures.length" class="w-full" title="Software Features">
          <ul>
            <li
              v-for="(detail, index) in softwareFeatures"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
        </DropDown>
      </div>
    </div>
  </div>

    <!-- Similar Products -->
    <div v-if="similarProducts.length" class="w-full flex flex-col gap-2">
      <div class="w-full flex justify-between">
        <h1 class="text-2xl font-bold">Similar Products</h1>
        <router-link
          to="/products"
          class="hover:text-blue-500 text-lg font-semibold"
        >
          View All <i class="fa-solid fa-angles-right"></i>
        </router-link>
      </div>
      <div class="w-full flex gap-8">
        <ProductCard />
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
