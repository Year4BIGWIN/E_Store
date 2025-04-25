<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Cookies from "universal-cookie";
import Buttom from "@/components/Buttom.vue";
import ProductCard from "@/components/ProductCard.vue";
import DropDown from "@/components/DropDown.vue";
import { useCartStore } from "@/store/cartStore";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const route = useRoute();
const product = ref({});
const error = ref(null);
const isLoading = ref(true);
const similarProducts = ref([]);
const quantity = ref(1);

const fetchProduct = async (id) => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${apiUrl}/product/${id}`);
    product.value = data || {};
    product.value.images = data?.images || [data?.image_url];
    product.value.rating = data?.rating || 0;
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
    const cartStore = useCartStore(); // Access Pinia cart store
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
          <div class="w-full h-[500px] bg-[#d9d9d9] rounded-xl">
            <img
              :src="product.data.firstImageUrl"
              class="w-full h-full object-fill rounded-xl"
              :alt="product.model"
              @error="(e) => (e.target.src = '/placeholder-image.jpg')"
            />
          </div>
          <div class="w-full flex gap-2">
            <div
              v-for="(img, index) in product.data.images"
              :key="index"
              class="w-[150px] h-[150px] bg-black rounded-xl cursor-pointer"
              @click="product.image_url = img"
            >
              <img
                :src="img"
                class="w-full h-[150px] object-fill rounded-xl"
                :alt="`Thumbnail ${index + 1}`"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="w-1/2 flex flex-col gap-4">
          <h1 class="text-4xl font-bold">
            {{ product.data.model || "Product Title" }}
          </h1>
          <div class="flex items-center gap-2">
            <i
              v-for="star in 5"
              :key="star"
              class="fa-solid fa-star"
              :style="{ color: star <= product.rating ? '#FFD43B' : '#d9d9d9' }"
            ></i>
          </div>
          <hr class="w-full" />

          <!-- Product Variations -->
          <div v-if="product.variants" class="flex flex-col gap-4">
            <div v-for="(variant, name) in product.variants" :key="name">
              <h3 class="text-lg font-semibold">Choose {{ name }}</h3>
              <div class="flex gap-2 mt-2">
                <button
                  v-for="option in variant"
                  :key="option"
                  class="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <hr class="w-full" />
          <div class="flex gap-10 items-center">
            <h1 class="text-4xl">
              ${{ product.data.price?.toLocaleString() || "0.00" }}
            </h1>
            <div
              class="flex items-center gap-4 bg-gray-100 rounded-xl px-4 py-2"
            >
              <button
                class="text-2xl hover:text-blue-500"
                @click="updateQuantity('decrement')"
              >
                &minus;
              </button>
              <span class="text-xl w-8 text-center">{{ quantity }}</span>
              <button
                class="text-2xl hover:text-blue-500"
                @click="updateQuantity('increment')"
              >
                &plus;
              </button>
            </div>
          </div>
          <hr class="w-full" />

          <!-- Action Buttons -->
          <div class="w-full flex items-center justify-between gap-1">
            <Buttom
              @click="addToCart(product.data.id, quantity)"
              class="w-full"
              variant="secondary"
              size="lg"
              >Add to Cart</Buttom
            >
            <Buttom class="w-full" variant="primary" size="lg">Buy Now</Buttom>
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
        <DropDown class="w-full" title="Display">
          <ul v-if="displayDetails.length">
            <li
              v-for="(detail, index) in displayDetails"
              :key="index"
              class="w-full flex py-2"
            >
              <span class="w-1/4">{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No display details available.</p>
        </DropDown>

        <!-- Performance Details -->
        <DropDown class="w-full" title="Performance">
          <ul v-if="performanceDetails.length">
            <li
              v-for="(detail, index) in performanceDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No performance details available.</p>
        </DropDown>

        <!-- Camera Details -->
        <DropDown class="w-full" title="Camera">
          <ul v-if="cameraDetails.length">
            <li
              v-for="(detail, index) in cameraDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No camera details available.</p>
        </DropDown>

        <!-- Battery Details -->
        <DropDown class="w-full" title="Battery">
          <ul v-if="batteryDetails.length">
            <li
              v-for="(detail, index) in batteryDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No battery details available.</p>
        </DropDown>

        <!-- Connectivity Details -->
        <DropDown class="w-full" title="Connectivity">
          <ul v-if="connectivityDetails.length">
            <li
              v-for="(detail, index) in connectivityDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No connectivity details available.</p>
        </DropDown>

        <!-- Build Details -->
        <DropDown class="w-full" title="Build & Design">
          <ul v-if="buildDetails.length">
            <li
              v-for="(detail, index) in buildDetails"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No build details available.</p>
        </DropDown>

        <!-- Other Features -->
        <DropDown class="w-full" title="Other Features">
          <ul v-if="otherFeatures.length">
            <li
              v-for="(detail, index) in otherFeatures"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No other features available.</p>
        </DropDown>

        <!-- Software Features -->
        <DropDown class="w-full" title="Software Features">
          <ul v-if="softwareFeatures.length">
            <li
              v-for="(detail, index) in softwareFeatures"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ detail.label }}:</span>
              <span>{{ detail.value }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">No software features available.</p>
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
</template>
