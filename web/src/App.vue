<template>
    <router-view v-if="isAccountLoaded"/>
    <Loading v-else/>
</template>

<script lang="ts" setup>
import { useAuthManagement } from './composables/useAuthManagement';
import Loading from './views/Loading.vue';

const { isAccountLoaded } = useAuthManagement();
</script>
