<template>
    <div class="center">
        <div class="card card-body max-w-xl bg-base-100 m-4 text-center">
            <h1 class="mb-2">Cafet CESI Nancy</h1>
            <SessionChoice :disabled="loadingSession"
                           class="border-secondary"
                           title="Démarrer une nouvelle session"
                           @click="handleChoiceClick('new')"/>
            <SessionChoice v-if="showLastSession"
                           :disabled="loadingSession"
                           :subtitle="`Session du ${lastSessionDate}`"
                           class="border-primary"
                           title="Continuer la session précédente"
                           @click="handleChoiceClick('last')"/>
            <router-link to="/test-session"
                         class="p-4 mt-4 border-warning border-2 rounded-xl hover:scale-105 transition cursor-pointer select-none text-xl">
                Démarrer une session test
            </router-link>
            <a :href="ENDPOINT + '/admin/'"
               class="p-4 mt-4 border-accent border-2 rounded-xl hover:scale-105 transition cursor-pointer select-none text-xl">
                Accéder à Directus
            </a>
        </div>
    </div>

    <DiscordMessagePopup :showDiscordModal="showDiscordModal"
                         @close="handleDiscordPopupClose"
                         @chose="handleDiscordPopupClick"/>
</template>

<script lang="ts" setup>
import { ENDPOINT } from '@/api/client';
import DiscordMessagePopup from '@/components/home/DiscordMessageModal.vue';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useSessionsStore } from '@/stores/sessions';
import SessionChoice from './SessionChoice.vue';

const sessionsStore = useSessionsStore();
const router = useRouter();

const loadingSession = ref(false);
const showDiscordModal = ref(false);

const lastSessionDate = computed(() =>
    dayjs(sessionsStore.lastSession?.date_updated || sessionsStore.lastSession?.date_created)
        .format('D MMMM à H[h]mm'),
);

// Show the last session if it exists and if it's less than 2h old
const showLastSession = computed(() =>
    sessionsStore.lastSession
    && dayjs(sessionsStore.lastSession?.date_created).add(2, 'hour').isAfter(dayjs()),
);

async function handleChoiceClick(choice: 'new' | 'last') {
    if (loadingSession.value)
        return;

    switch (choice) {
        case 'new':
            loadingSession.value = true;
            showDiscordModal.value = true;
            break;
        case 'last':
            sessionsStore.selectLastSession();
            await router.push('/session');
            break;
    }
}

function handleDiscordPopupClose() {
    showDiscordModal.value = false;
    loadingSession.value = false;
}

async function handleDiscordPopupClick() {
    await sessionsStore.createSession();
    loadingSession.value = false;
    await router.push('/session');
}
</script>
