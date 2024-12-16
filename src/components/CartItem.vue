<template>
    <div class="w-full flex items-center justify-between">
        <div class="w-2/5 flex items-center gap-4">
          <div class="w-20 h-20 bg-slate-300 rounded-xl"></div>
          <h1>Product Name</h1>
        </div>

        <div class="w-3/5 justify-between flex">
          <h1>$Price</h1>
          <div class="flex items-center gap-4 bg-[#d9d9d9] rounded-xl px-4">
            <button class="text-2xl">&minus;</button>
            <h1 class="text-xl">1</h1>
            <button class="text-2xl">&plus;</button>
          </div>
          <div class="flex items-center gap-4 mr-10">
            <h1>$Sub Total</h1>
            <button class="flex items-center hover:text-red-500">
              <hr class="w-[15px] border-gray-400 rotate-90" />
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
</template>