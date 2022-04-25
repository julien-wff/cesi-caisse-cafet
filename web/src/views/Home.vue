<template>
    <div class="absolute top-4 right-6 text-right">{{ userStore.name }}</div>
    <SessionSelection v-if="sessionsLoaded"/>
    <Loading v-else/>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useSessionsStore } from '@/stores/sessions';
import { useUserStore } from '@/stores/user';
import SessionSelection from '@/components/home/SessionSelection.vue';
import Loading from './Loading.vue';

const userStore = useUserStore();
const sessionsStore = useSessionsStore();

const sessionsLoaded = ref(false);

// if sessions were already loaded, fetch them in the background
if (sessionsStore.lastSession)
    sessionsLoaded.value = true;

sessionsStore.fetchSessions()
    .then(() => {
        sessionsLoaded.value = true;
    });
</script>
