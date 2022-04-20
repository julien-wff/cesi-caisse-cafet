<template>
    <div class="center flex-col p-4 gap-8">
        <h1>Cafet CESI</h1>
        <div class="loader-big"></div>
        <p v-if="error" class="text-error">{{ error }}</p>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    error?: string;
}>();
</script>
