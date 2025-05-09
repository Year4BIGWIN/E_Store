<template>
  <div class="p-2 border rounded-md shadow-sm bg-white">
    <h3 class="text-lg font-semibold mb-4 pb-2 border-b">Additional Information</h3>
    
    <!-- Empty state message -->
    <div v-if="Object.keys(localValue).length === 0" class="text-center py-4 text-gray-500 italic">
      No additional information added yet
    </div>
    
    <!-- Display existing key-value pairs -->
    <div v-else class="space-y-2 mb-2">
      <div class="max-h-[100px] overflow-y-auto custom-scrollbar">
        <div v-for="(value, key, index) in localValue" :key="index" 
             class="mb-3 flex items-center gap-2 rounded-md hover:bg-gray-50 transition-colors">
      <div class="flex-1">
            <label :for="`property-${index}`" class="sr-only">Property name</label>
        <input 
              :id="`property-${index}`"
          type="text" 
          v-model="keys[index]" 
          placeholder="Property name"
          @input="updateKeyAt(index)" 
              class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
        />
      </div>
      <div class="flex-1">
            <label :for="`value-${index}`" class="sr-only">Value</label>
        <input 
              :id="`value-${index}`"
          type="text" 
          v-model="localValue[key]" 
          placeholder="Value"
              class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
        />
      </div>
      <button 
        type="button" 
        @click="removeItem(key)"
            class="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors shrink-0"
            :aria-label="`Remove ${key} property`"
      >
        <span class="text-sm">✕</span>
      </button>
    </div>
      </div>
    </div>
    
    <div class="border-t pt-4 mt-4">
      <h4 class="text-sm font-medium mb-2 text-gray-700">Add New Property</h4>
    <!-- Add new key-value pair -->
      <div class="flex items-center gap-2">
      <div class="flex-1">
        <input 
          type="text" 
          v-model="newKey" 
            placeholder="Property name"
            @keyup.enter="newValue ? addItem() : $refs.valueInput.focus()"
            class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
        />
      </div>
      <div class="flex-1">
        <input 
          type="text" 
          v-model="newValue" 
            ref="valueInput"
            placeholder="Value"
            @keyup.enter="newKey.trim() ? addItem() : null"
            class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
        />
      </div>
      <button 
        type="button" 
        @click="addItem"
        :disabled="!newKey.trim()"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Add new property"
      >
        <span class="text-sm">+</span>
      </button>
    </div>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
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
const error = ref('');
const valueInput = ref(null);

// Initialize keys array from modelValue object
watch(() => props.modelValue, () => {
  keys.value = Object.keys(props.modelValue);
}, { immediate: true });

// Updates a key at specific index
function updateKeyAt(index) {
  const oldKey = Object.keys(localValue.value)[index];
  const newKey = keys.value[index];
  
  if (oldKey === newKey) return;
  
  // Check for duplicate keys
  if (Object.keys(localValue.value).some((k, i) => k === newKey && i !== index)) {
    keys.value[index] = oldKey; // Reset to old key
    error.value = "This property name already exists!";
    setTimeout(() => error.value = '', 3000);
    return;
  }
  
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
    error.value = 'This property already exists!';
    setTimeout(() => error.value = '', 3000);
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
  error.value = '';
}

// Remove an item by key
function removeItem(key) {
  const updatedValue = { ...localValue.value };
  delete updatedValue[key];
  
  keys.value = keys.value.filter(k => k !== key);
  emit('update:modelValue', updatedValue);
}
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>