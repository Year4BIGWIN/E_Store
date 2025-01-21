<template>
    <div class="w-full h-full flex items-center justify-center">
        <Upload :uploadedImageUrl="uploadedImageUrl" @update:uploadedImageUrl="uploadedImageUrl = $event" />
    </div>
    
</template>
<script setup>
import Upload from '../../components/Upload.vue';
</script>
