<template>
    <div class="w-[270px] px-4 py-4 bg-white flex flex-col items-center rounded-xl">
        <img :src="image || defaultImage" alt="Product Image" class="w-full h-[120px] object-cover rounded-xl" />
        <div class="w-full flex flex-col items-center justify-between gap-2">
            <h1 class="text-lg">{{ name }}</h1>
            <h1 class="text sm">{{ quantity }}</h1>
            <div class="w-full flex justify-between">
                <button class="w-full border px-4 py-2 hover:bg-black rounded-full text-white bg-blue-500">Edit</button>
                <button @click="handleDelete" class="w-full border px-4 py-2 hover:bg-black rounded-full text-white bg-red-500">Delete</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import defaultImage from "../assets/image/Logo.png";

const props = defineProps({
    name: {
        type: String,
        default: "Product Name"
    },
    quantity: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: null
    },
    id: {
        type: Number,
        required: true
    }
});

const emits = defineEmits(['delete']);

const handleDelete = () => {
    emits('delete', props.id);
};
</script>