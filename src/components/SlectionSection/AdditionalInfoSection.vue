<template>
  <div class="p-4 border rounded-md">
    <h3 class="text-lg font-semibold mb-4">Additional Information</h3>
    
    <!-- Display existing key-value pairs -->
    <div v-for="(value, key, index) in localValue" :key="index" class="mb-3 flex items-center gap-2">
      <div class="flex-1">
        <input 
          type="text" 
          v-model="keys[index]" 
          placeholder="Property name"
          @input="updateKeyAt(index)" 
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="flex-1">
        <input 
          type="text" 
          v-model="localValue[key]" 
          placeholder="Value"
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <button 
        type="button" 
        @click="removeItem(key)"
        class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        <span class="text-sm">✕</span>
      </button>
    </div>
    
    <!-- Add new key-value pair -->
    <div class="mt-4 flex items-center gap-2">
      <div class="flex-1">
        <input 
          type="text" 
          v-model="newKey" 
          placeholder="Add new property name"
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="flex-1">
        <input 
          type="text" 
          v-model="newValue" 
          placeholder="Add new value"
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <button 
        type="button" 
        @click="addItem"
        :disabled="!newKey.trim()"
        class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <span class="text-sm">+</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

// Local copy of the modelValue
const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// For tracking property keys
const keys = ref([]);
const newKey = ref('');
const newValue = ref('');

// Initialize keys array from modelValue object
watch(() => props.modelValue, () => {
  keys.value = Object.keys(props.modelValue);
}, { immediate: true });

// Updates a key at specific index
function updateKeyAt(index) {
  const oldKey = Object.keys(localValue.value)[index];
  const newKey = keys.value[index];
  
  if (oldKey === newKey) return;
  
  // Create a new object with updated keys
  const updatedValue = {};
  Object.keys(localValue.value).forEach((key, i) => {
    if (i === index) {
      updatedValue[newKey] = localValue.value[oldKey];
    } else {
      updatedValue[key] = localValue.value[key];
    }
  });
  
  emit('update:modelValue', updatedValue);
}

// Add a new key-value pair
function addItem() {
  if (!newKey.value.trim()) return;
  
  // Check if key already exists
  if (localValue.value.hasOwnProperty(newKey.value)) {
    alert('This property already exists!');
    return;
  }
  
  const updatedValue = { 
    ...localValue.value,
    [newKey.value]: newValue.value 
  };
  
  emit('update:modelValue', updatedValue);
  keys.value.push(newKey.value);
  newKey.value = '';
  newValue.value = '';
}

// Remove an item by key
function removeItem(key) {
  const updatedValue = { ...localValue.value };
  delete updatedValue[key];
  
  keys.value = keys.value.filter(k => k !== key);
  emit('update:modelValue', updatedValue);
}
</script>