<template>
    <div class="bg-primary w-full h-24 p-8 flex items-center justify-between text-primary-content">
        <h2>Total : {{ totalPrice }}</h2>
        <button class="btn btn-secondary" @click="sellStore.confirmSell">
            Valider
            <DoubleArrow class="ml-3 w-5 h-5" fill="#FFF"/>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useSellStore } from '@/stores/sell';
import { currencyFormat } from '@/utils/currency';
import DoubleArrow from '../icons/DoubleArrow.vue';

const sellStore = useSellStore();

const totalPrice = computed(() => currencyFormat.format(sellStore.totalPrice));
</script>
