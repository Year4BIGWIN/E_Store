<template>
  <div
    class="relative w-full rounded-lg overflow-hidden shadow-md my-2.5 transition-all duration-300 ease-in-out bg-white group hover:-translate-y-1 hover:shadow-lg"
    :class="{ 'border-2 border-green-500 ring-2 ring-green-500/30': active }"
  >
    <div class="relative h-[100px] overflow-hidden">
      <img
        :src="imageUrl"
        alt="Slide image"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-2.5 py-4"
      >
        <div class="p-0 text-white">
          <p
            v-if="title"
            class="m-0 font-bold whitespace-nowrap overflow-hidden text-ellipsis text-lg"
          >
            {{ title }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-between p-3 bg-gray-50">
      <button
        class="px-3 py-2 border-0 rounded-md cursor-pointer text-sm flex items-center gap-1.5 transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600"
        @click="handleEdit"
      >
        <i class="fas fa-edit"></i> Edit
      </button>
      <button
        class="px-3 py-2 border-0 rounded-md cursor-pointer text-sm flex items-center gap-1.5 transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
        @click="confirmDelete"
      >
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["edit", "delete"]);

function handleEdit() {
  emit("edit", props.id);
}

function confirmDelete() {
  if (confirm("Are you sure you want to delete this slide?")) {
    emit("delete", props.id);
  }
}
</script>
