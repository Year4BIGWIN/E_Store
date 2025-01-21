<template>
 
    
      <div class="w-[125px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer">
        <img
          :src="image"
          alt="Brand"
          @click="goToProductPage"
          class="h-10 rounded-[5px] w-full object-cover"
        />
        <h1 class="text-sm text-center">{{ name }}</h1>
      </div>

</template>

<script setup>
import { useRouter } from "vue-router";
import { defineProps, defineEmits } from "vue";
import defaultImage from "../assets/image/Logo.png";



const router = useRouter();




const goToProductPage = () => {
  console.log("go to product page");
};

const props = defineProps({
    image: {
        type: String,
        default: null
    },
    id: {
        type: Number,
        required: true
    },
});
</script>
