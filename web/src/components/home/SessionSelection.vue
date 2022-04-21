<template>
    <div class="center">
        <div class="card card-body max-w-xl bg-base-100 m-4 text-center">
            <h1 class="mb-2">Cafet CESI Nancy</h1>
            <SessionChoice class="border-secondary" title="Démarrer une nouvelle session"/>
            <SessionChoice v-if="showLastSession"
                           :subtitle="`Session du ${lastSessionDate}`"
                           class="border-primary"
                           title="Continuer la session précédente"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useSessionsStore } from '../../stores/sessions';
import SessionChoice from './SessionChoice.vue';

const sessionsStore = useSessionsStore();

const lastSessionDate = computed(() =>
    dayjs(sessionsStore.lastSession?.date_updated || sessionsStore.lastSession?.date_created)
        .format('D MMMM à H[h]mm'),
);

// Show the last session if it exists and if it's less than 2h old
const showLastSession = computed(() =>
    sessionsStore.lastSession
    && dayjs(sessionsStore.lastSession?.date_created).add(2, 'hour').isAfter(dayjs()),
);
</script>
