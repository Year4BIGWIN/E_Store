<template>

<div class="w-[1152px] justify-start flex flex-col gap-10 py-10">
    <div class="w-full flex gap-4 font-semibold text-lg">
        <router-link ><span class="hover:text-blue-500">Home</span></router-link>
        <router-link >&#x2022 &nbsp &nbsp <span class="hover:text-blue-500">Product</span></router-link>
        <router-link >&#x2022 &nbsp &nbsp <span class="hover:text-blue-500">Categoies</span></router-link>
    </div>
    <div class="w-full flex gap-4">
        <div class="w-1/2 flex flex-col gap-4">
            <div class="w-full h-[500px] bg-[#d9d9d9]"></div>
            <div class="w-full flex gap-2">
                <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-xl"></div>
                <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-xl"></div>
                <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-xl"></div>
                <div class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-xl"></div>
            </div>
        </div>
        <div class="w-1/2 h-[500px] flex flex-col gap-4">
            <h1 class="text-4xl">Name</h1>
            <div class="flex">
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
            </div>
            <hr class="w-full">
            <div class="flex flex-col gap-4">
                <h1>Chose a Colour</h1>
                <div class="flex gap-2">
                    <div class="bg-[#d9d9d9] rounded-full w-[40px] h-[40px]"></div>
                    <div class="bg-[#d9d9d9] rounded-full w-[40px] h-[40px]"></div>
                    <div class="bg-[#d9d9d9] rounded-full w-[40px] h-[40px]"></div>
                    <div class="bg-[#d9d9d9] rounded-full w-[40px] h-[40px]"></div>
                </div>
            </div>
            <hr class="w-full">
            <div class="flex flex-col gap-4">
                <h1>Chose a memory (RAM)</h1>
                <div class="flex gap-2">
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">12G</div>
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">12G</div>
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">12G</div>
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">12G</div>
                </div>
            </div>
            <hr class="w-full">
            <div class="flex flex-col gap-4">
                <h1>Chose a Storage</h1>
                <div class="flex gap-2">
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">32G</div>
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">64G</div>
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">128G</div>
                    <div class="border w-[60px] h-[60px] flex justify-center items-center">256G</div>
                </div>
            </div>
            <hr class="w-full">
            <div class="flex gap-10">
                <h1 class="text-4xl">$Price</h1>
                <div class="flex items-center gap-4 bg-[#d9d9d9] rounded-xl px-4">
                    <button class="text-2xl">&minus;</button>
                    <h1 class="text-xl">1</h1>
                    <button class="text-2xl">&plus;</button>
                </div>
            </div>
            <hr class="w-full">
            <div class="w-full flex items-center justify-between gap-1">
        <Buttom class="w-full" variant="secondary" size="lg"
          >Add to Cart</Buttom
        >
        <Buttom class="w-full" variant="primary" size="lg">Buy Now</Buttom>
      </div>
        </div>
    </div>

    <div class="w-full flex flex-col gap-4">
        <h1 class="font-semibold text-2xl">Specifice Products Infomation</h1>
        <div class="w-full flex gap-10">
            <div class="w-full flex flex-col gap-4 p-4 bg-gray-200">
                <h1 class="font-semibold text-xl">General Information</h1>
                <div class="w-full">
                    <div class="flex p-2 bg-white rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-[#d9d9d9] rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-white rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-[#d9d9d9] rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-white rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-[#d9d9d9] rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                </div>
            </div>
            
            <div class="w-full flex flex-col gap-4 p-4 bg-gray-200">
            <h1 class="font-semibold text-xl">Product Details</h1>
                <div class="w-full">
                    <div class="flex p-2 bg-white rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-[#d9d9d9] rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-white rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-[#d9d9d9] rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-white rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                    <div class="flex p-2 bg-[#d9d9d9] rounded-lg">
                        <h3 class="w-1/3">Product Name</h3>
                        <p class="w-full">Product Name</p>
                    </div>
                </div>
            </div>

        </div>
        
    </div>

    <div class="w-full flex flex-col gap-2">
    <div class="w-full flex justify-between">
        <h1 class="text-2xl font-bold">Similar Products</h1>
        <router-link class="hover:text-blue-500 text-lg font-semibold" to="/product">View All <i class="fa-solid fa-angles-right"></i></router-link>
    </div>
    <div class="w-full flex gap-8">
        <ProductCard />
        <ProductCard />
        <ProductCard />
    </div>

</div>

</div>

</template>

<script setup>
import router from "@/router";
import Buttom from "@/components/Buttom.vue";
import ProductCard from "@/components/ProductCard.vue";

</script>