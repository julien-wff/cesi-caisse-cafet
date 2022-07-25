<template>
    <div>
        Compte : {{ count }}
        <button @click="count++"></button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style scoped>
button {
    background: red;
    color: white;
    padding: 4px;
    border-radius: 4px;
}
</style>
