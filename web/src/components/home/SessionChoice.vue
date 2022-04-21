<template>
    <div :class="`p-4 mt-4 border-2 rounded-xl hover:scale-105 transition
                cursor-pointer select-none ${props.class}
                ${disabled ? 'pointer-events-none opacity-25' : ''}`">
        <span class="block text-xl leading-tight">{{ title }}</span>
        <span v-if="subtitle" class="leading-tight mt-2 block">{{ subtitle }}</span>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    title: string,
    subtitle?: string,
    class?: string,
    disabled?: boolean,
}>();
</script>
