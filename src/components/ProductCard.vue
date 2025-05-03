<script setup>
import { defineProps, ref, onMounted } from "vue";
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

const addToCart = async (phoneId, quantity) => {
  try {
    isAddingToCart.value = true;
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Validate token
    if (!token || token.split(".").length !== 3) {
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath }});
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

    console.log("Add to cart response:", responseData);

    // Show toast notification
    showAddedToast.value = true;
    setTimeout(() => {
      showAddedToast.value = false;
    }, 2000);
    
    // Fetch updated cart after adding an item
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
      class="w-full h-[200px] bg-[#f5f5f5] relative group"
    >
      <img
        :src="product.firstImageUrl"
        alt="..."
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <h2
        class="absolute top-2 right-2 text-[12px] bg-white/90 rounded-full px-3 py-1 text-black shadow-sm"
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
    <div class="w-full flex items-center justify-between gap-1">
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

  <transition name="fade">
    <div v-if="showAddedToast" class="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 flex items-center">
      <i class="fa-solid fa-check-circle mr-2"></i>
      <span>Added to cart successfully!</span>
    </div>
  </transition>
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
