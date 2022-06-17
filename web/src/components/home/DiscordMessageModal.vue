<template>
    <div :class="{modal: true, 'modal-open': showDiscordModal}" @click.self="$emit('close')">
        <div class="modal-box relative">
            <div class="btn btn-sm btn-circle absolute right-2 top-2" @click="$emit('close')">✕</div>

            <h3 class="text-lg font-bold">
                Alerte Discord
            </h3>

            <p class="py-4">
                Souhaitez vous envoyer sur Discord un message d'alerte concernant l'ouverture ?
            </p>

            <p class="pb-4 text-error font-bold" v-if="error">{{ error }}</p>

            <div class="flex gap-4">
                <button class="btn btn-error flex-1" @click="handleRefuseClick" :disabled="loading">Non</button>
                <button class="btn btn-success flex-1" @click="handleAcceptClick" :disabled="loading">Oui</button>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { postDiscordMessage } from '@/api/sessions/postDiscordMessage';
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'chose'): void,
}>();

defineProps<{
    showDiscordModal: boolean,
}>();

const loading = ref(false);
const error = ref<string | null>(null);

async function handleAcceptClick() {
    loading.value = true;
    try {
        await postDiscordMessage();
        emit('chose');
    } catch (e) {
        error.value = e instanceof Error ? e.message : (e as any).toString();
        loading.value = false;
    }
}

function handleRefuseClick() {
    loading.value = true;
    emit('chose');
}
</script>
