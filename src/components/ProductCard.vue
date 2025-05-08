<script setup>
import { defineProps, ref } from "vue";
import Buttom from "./Buttom.vue";
import { useRouter } from "vue-router";
import Cookies from "universal-cookie";
import { useCartStore } from "@/store/cartStore";
import Checkout from "@/components/CheckOut/Checkout.vue";
import Rating from "./Rating.vue";

const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;
const cartStore = useCartStore();

const checkoutRef = ref(null);

const isAddingToCart = ref(false);
const isBuyingNow = ref(false);
const showAddedToast = ref(false);
const defaultImage = new URL('/src/assets/image/Logo.png', import.meta.url).href;

const handleImageError = (e) => {
  e.target.src = defaultImage;
};

const addToCart = async (phoneId, quantity) => {
  try {
    isAddingToCart.value = true;
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Check if user is authenticated
    if (!token) {
      router.push({ 
        name: "login", 
        query: { redirect: router.currentRoute.value.fullPath } 
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

    if (!response.ok) {
      if (responseData.message === "Out of stock") {
        // Show out of stock toast notification
        toast.error("Item is out of stock!");
      } else {
        // Handle other errors
        toast.error("Failed to add item to cart.");
      }
      return;
    }

    // Show toast notification
    showAddedToast.value = true;
    setTimeout(() => {
      showAddedToast.value = false;
    }, 2000);
    
    await cartStore.fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
  } finally {
    isAddingToCart.value = false;
  }
};

const buyNow = async (phoneId, quantity = 1) => {
  try {
    isBuyingNow.value = true;
    
    // Check if user is authenticated
    const cookies = new Cookies();
    const token = cookies.get("auth_token");
    
    if (!token) {
      // Redirect to login page with return URL
      router.push({ 
        name: "login", 
        query: { redirect: router.currentRoute.value.fullPath } 
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
  // Refresh cart after successful checkout
  cartStore.fetchCart();
};

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const goToProductDetail = () => {
  router.push({
    name: "productDetail",
    params: { id: props.product.id },
  });
};
</script>

<template>
  <div
    class="cursor-pointer w-[265px] border rounded-lg hover:shadow-lg transition-all duration-300 flex flex-col justify-start gap-2 overflow-hidden"
  >
  <div
  @click="goToProductDetail"
  class="aspect-square w-full overflow-hidden bg-[#f5f5f5] relative group"
>
  <img
    :src="product.firstImageUrl || defaultImage"
    alt="Product image"
    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    @error="handleImageError"
  />
  <h2
    class="absolute top-2 right-2 text-[12px] bg-gray-200/60 rounded-full px-3 py-1 text-black shadow-sm"
  >
    {{ product.productType.name }}
  </h2>
</div>
    <div class="flex flex-col p-3 gap-3">
      <div class="flex flex-col">
        <h1 class="text-lg font-semibold line-clamp-1 hover:line-clamp-none transition-all">{{ product.model }}</h1>
        <div class="flex items-center justify-between mt-1">
          <div class="flex items-center gap-1">
            <div class="flex items-center gap-2">
              <Rating :initialRating="product.averageRating || 0" :readonly="true" />
            </div>
          </div>
          <div class="flex items-center">
            <span class="font-medium text-gray-500 text-sm mr-1">$</span>
            <h1 class="font-bold text-lg">{{ product.price.toLocaleString() }}</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex items-center px-2 justify-between gap-1">
      <Buttom
        @click="addToCart(product.id, product.quantity)"
        class="w-full"
        variant="secondary"
        size="sm"
        >Add to Cart</Buttom
      >
      <Buttom
        @click.stop="buyNow(product.id, product.quantity)"
        class="w-full"
        variant="primary"
        size="lg"
        >Buy Now</Buttom
      >
    </div>

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

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
