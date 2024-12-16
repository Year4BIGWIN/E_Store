<template>
    <div class="w-screen rounded-xl flex flex-col mt-10 gap-6 items-center justify-center">
        <div class="w-[1152px] flex justify-between">
            <div class="flex gap-1">
                <router-link to="/" class="text-sm hover:bg-black hover:text-white px-4 py-2 border rounded-full">All</router-link>
                <router-link to="/" class="text-sm px-4 py-2 border rounded-full">Mobile Phone</router-link>
                <router-link to="/" class="text-sm px-4 py-2 border rounded-full">Tablet</router-link>
                <router-link to="/" class="text-sm px-4 py-2 border rounded-full">Smart Watch</router-link>
                <router-link to="/" class="text-sm px-4 py-2 border rounded-full">Accesories</router-link>
            </div>
            <div>
                <router-link to="/products" class="text-sm px-4 py-2 border rounded-full">See All Product</router-link>
            </div>
        </div>
        <div class="w-[1152px] grid grid-cols-3 gap-10 mt-5">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </div>

        <div class="w-screen mt-5 bg-[#dfe7e8] flex justify-center p-16">
            
            <div class="w-[1152px] flex flex-col gap-4">
                <h1 class="text-2xl">PRODUCT CATEGORIES</h1>
            <div class="w-full flex gap-6">
                <div class="bg-white w-[275px] px-4 py-4 flex  items-center rounded-xl">
                <i class="fa-solid fa-mobile-screen-button fa-2x"></i>
                <hr class="w-10 border border-gray-400 rotate-90">
                <div>
                    <h1 class="text-xl">Mobile Phone</h1>
                    <router-link to="/home" class="text-sm text-gray-400 hover:text-blue-500">view all <i class="fa-solid fa-angles-right"></i></router-link>
                </div>
            </div>
            <div class="bg-white w-[275px] px-4 py-4 flex items-center rounded-xl">
                <i class="fa-solid fa-tablet-screen-button fa-2x"></i>
                <hr class="w-10 border border-black rotate-90">
                <div>
                    <h1 class="text-xl">Tablet</h1>
                    <router-link to="/home" class="text-sm text-gray-400 hover:text-blue-500">view all <i class="fa-solid fa-angles-right"></i></router-link>
                </div>
            </div>
            <div class="bg-white w-[275px] px-4 py-4 flex items-center rounded-xl">
                <svg fill="none" height="50" viewBox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 6.40135V4C7.5 2.89543 8.39543 2 9.5 2H14.5C15.6046 2 16.5 2.89543 16.5 4V6.40135C17.3967 6.92006 18 7.88958 18 9V10C18.5523 10 19 10.4477 19 11V12C19 12.5523 18.5523 13 18 13V15C18 16.1104 17.3967 17.0799 16.5 17.5987L16.5 20C16.5 21.1046 15.6046 22 14.5 22H9.5C8.39543 22 7.5 21.1046 7.5 20L7.5 17.5987C6.6033 17.0799 6 16.1104 6 15V9C6 7.88958 6.6033 6.92006 7.5 6.40135ZM9.5 3.5C9.22386 3.5 9 3.72386 9 4V6H15V4C15 3.72386 14.7761 3.5 14.5 3.5H9.5ZM16.5 15V9C16.5 8.17157 15.8284 7.5 15 7.5H9C8.17157 7.5 7.5 8.17157 7.5 9V15C7.5 15.8284 8.17157 16.5 9 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15ZM9 20C9 20.2761 9.22386 20.5 9.5 20.5H14.5C14.7761 20.5 15 20.2761 15 20V18H9L9 20Z" fill="#212121"/></svg>
                <hr class="w-10 border border-black rotate-90">
                <div>
                    <h1 class="text-xl">Smart Watch</h1>
                    <router-link to="/home" class="text-sm text-gray-400 hover:text-blue-500">view all <i class="fa-solid fa-angles-right"></i></router-link>
                </div>
            </div>
            <div class="bg-white w-[275px] px-4 py-4 flex items-center rounded-xl">
                <i class="fa-solid fa-headphones-simple fa-2x"></i>
                <hr class="w-10 border border-black rotate-90">
                <div>
                    <h1 class="text-xl">Accesories</h1>
                    <router-link to="/home" class="text-sm text-gray-400 hover:text-blue-500">view all <i class="fa-solid fa-angles-right"></i></router-link>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ProductCard from './ProductCard.vue';
</script>