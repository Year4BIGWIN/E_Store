<template>
  <div class="about max-w-7xl w-full">
    <!-- <ProductDetail /> -->
    <!-- <Profile /> -->
    <MyCard />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ProductDetail from '@/views/user/ProductDetail.vue';
import Profile from '@/views/user/Profile.vue';
import MyCard from '@/views/user/MyCart.vue';
</script>
