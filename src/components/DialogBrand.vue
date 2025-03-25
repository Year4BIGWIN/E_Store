<template>
    <div v-if="showDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-5 rounded-md w-[700px] flex gap-6">
            <div class="w-1/2">
                <h2 class="text-xl font-bold mb-4">Product Image</h2>
                <Upload :uploadedImageUrl="formData.image_url" @update:uploadedImageUrl="formData.image_url = $event" 
                class="h-64 w-full border-2 border-dashed rounded-lg flex items-center justify-center" />
            </div>
            <div class="w-1/2">
                <form @submit.prevent="handleSubmit">
                    <h2 class="text-xl font-bold mb-4">Add Brand</h2>
                    <div class="w-full grid grid-cols-2 gap-2">
                        <Input label="Brand Name :" v-model="formData.brand" required />
                        <Input label="Brand Description :" v-model="formData.description" required />
                    </div>
                    <div class="flex justify-end mt-4">
                        <button type="button" @click="closeDialog" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Input from '@/components/Input.vue';
import Upload from '@/components/Upload.vue';
import axios from 'axios';
import Cookies from 'universal-cookie'; 

const token = new Cookies().get("auth_token");
const apiUrl = import.meta.env.VITE_APP_API_URL;
const props = defineProps({ showDialog: Boolean });
const emit = defineEmits(["update:showDialog", "postsuccess"]);

const formData = ref({
  brand: '',
  description: '',
  image_url: '',
});

function closeDialog() {
  emit("update:showDialog", false);
}

function resetForm() {
    formData.value = {
        brand: '',
        description: '',
        image_url: '',
    };
}

async function handleSubmit() {
    try {
        if (!formData.value.brand || !formData.value.description) {
            return alert("Please fill all the fields");
        }
        await axios.post(`${apiUrl}/brand`, formData.value, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        emit("postsuccess", formData.value);
        resetForm();
        closeDialog();
        alert("Scuccessfully saved the brand.");
    } catch (error) {
        console.error(error);
        alert("An error occurred while saving the brand. Please try again.");
    }
}
</script>