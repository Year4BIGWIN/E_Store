<script setup>
import { defineProps, ref, computed } from "vue";
import Buttom from "./Buttom.vue";
import { useRouter } from "vue-router";
import Cookies from "universal-cookie";
import { useCartStore } from "@/store/cartStore";
import Checkout from "@/components/Checkout.vue";

const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;
const cartStore = useCartStore();

// Reference to the checkout component
const checkoutRef = ref(null);
// Single item cart for direct checkout
const singleItemCart = ref([]);
const singleItemTotal = ref(0);

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

const buyNow = async (phoneId, quantity) => {
  try {
    // First add the item to cart
    await addToCart(phoneId, quantity);

    // Fetch the entire cart instead of just the one item
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
    class="cursor-pointer w-[265px] border flex flex-col justify-start gap-2"
  >
    <div
      @click="goToProductDetail"
      class="w-full h-[200px] rounded-xl bg-[#d9d9d9] relative"
    >
      <img
        :src="product.firstImageUrl"
        alt="..."
        class="w-full h-full object-cover rounded-xl"
      />
      <h2
        class="absolute top-1 right-1 text-[12px] bg-white rounded-full px-3 text-black"
      >
        {{ product.productType.name }}
      </h2>
    </div>
    <div class="flex flex-col justify-start p-2 gap-4">
      <div class="flex flex-col">
        <h1 class="text-lg font-semibold">{{ product.model }}</h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <i class="fa-regular fa-star fa-xs" style="color: #bababa"></i>
            <h3 class="text-[12px] text-gray-400">( Review)</h3>
          </div>
          <div class="flex items-center">
            <i class="fa-solid fa-dollar-sign"></i>
            <h1 class="font-semibold text-lg">{{ product.price }}</h1>
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
    </div>

    <Checkout
      ref="checkoutRef"
      :cartItems="singleItemCart"
      :totalPrice="singleItemTotal"
      :showButton="false"
      @payment-successful="handleCheckoutSuccess"
      @update-cart="handleCheckoutSuccess"
    />
  </div>
</template>
