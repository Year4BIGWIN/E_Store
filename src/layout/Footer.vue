<script setup>
import Buttom from "@/components/Buttom.vue";
</script>

<template>
  <div class="max-w-6xl w-full flex flex-col gap-10 items-center">
    <div class="hidden md:block w-full bg-black text-white p-5 rounded-3xl">
      <div class="flex flex-col gap-2">
        <div class="flex flex-col text-5xl font-medium gap-3">
          <h1>Ready To Get</h1>
          <h1>Our New Stuff?</h1>
        </div>
        <div class="flex gap-2 justify-between">
          <div class="w-[250px] pt-5">
            <div class="bg-white flex text-black justify-between rounded-full">
              <input
                type="text"
                placeholder="Email"
                class="w-full rounded-full text-sm px-3 py-1 border-none focus:outline-none"
              />
              <Buttom variant="primary" size="sm">Send</Buttom>
            </div>
          </div>
          <div class="w-1/3 flex flex-col gap-2">
            <h1 class="text-sm text-semibold">HomeTech for Home and Needs</h1>
            <p class="text-[12px] text-gray-400">
              we'll listen to your needs, Identify the best approach, and then
              create a bespoke smart EV Charging soulution that right for you.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full bg-gray-100 rounded-xl md:bg-white flex justify-between p-5">
      <div class="flex gap-10">
        <div>
          <h1 class="font-bold text-xl">About Us</h1>
          <div class="flex flex-col gap-2">
            <router-link to="/about"> Blog </router-link>
            <router-link to="/about"> Meet the Team </router-link>
          </div>
        </div>
        <div>
          <h1 class="font-bold text-xl">Support</h1>
          <div class="flex flex-col gap-2">
            <router-link to="/about"> Contact Us </router-link>
            <router-link to="/about"> Shipping </router-link>
            <router-link to="/about"> Returns </router-link>
            <router-link to="/about"> FQA </router-link>
          </div>
        </div>
      </div>
      <div class="flex flex-col mt-20">
        <h1>SocialMedia</h1>
        <div class="flex gap-2">
          <router-link to="/about">
            <i class="fa-brands fa-facebook fa-2x"></i>
          </router-link>
          <router-link to="/about">
            <i class="fa-brands fa-x-twitter fa-2x"></i>
          </router-link>
          <router-link to="/about">
            <i class="fa-brands fa-linkedin fa-2x"></i>
          </router-link>
          <router-link to="/about">
            <i class="fa-brands fa-square-instagram fa-2x"></i>
          </router-link>
        </div>
      </div>
    </div>
    <hr class="w-screen border-gray-300" />
    <div class="w-full flex items-center justify-between gap-2 pb-7">
      <h1 class="text-gray-400">Copyright © 2023 HomeTech.All Rights Reserved</h1>
      <div class="flex gap-4">
        <router-link to="/about"> Terms of Service  </router-link>
        <router-link to="/about"> Privacy Policy </router-link>
      </div>
    </div>
  </div>
</template>
