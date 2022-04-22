<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" :class="props.class">
        <path :fill="fill" d="m246.6 233.4-160-160a31.99 31.99 0 1 0-45.25 45.25L178.8 256 41.4 393.4a31.99 31.99 0 1 0 45.22 45.23l160-160a31.98 31.98 0 0 0-.02-45.23zm192 0-160-160a31.99 31.99 0 1 0-45.25 45.25L370.8 256 233.4 393.4a31.99 31.99 0 1 0 45.22 45.23l160-160a31.98 31.98 0 0 0-.02-45.23z"/>
    </svg>
</template>

<script lang="ts" setup>
const props = defineProps<{
    fill?: string;
    class?: string;
}>();
</script>
