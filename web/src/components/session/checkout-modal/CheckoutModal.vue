<template>
    <div :class="{'modal': true, 'modal-open': showCheckoutModal}" @click.self="$emit('close')">
        <div class="modal-box relative">
            <div class="btn btn-sm btn-circle absolute right-2 top-2" @click="$emit('close')">✕</div>
            <h3 class="text-lg font-bold">
                Confirmation de la vente ({{ currencyFormat.format(sellStore.totalPrice) }})
            </h3>

            <div class="pt-4">
                <PackedSell v-for="packedSell in sellStore.packing.packedSells"
                            :key="packedSell.pack.id"
                            :packed-sell="packedSell"/>
                <ul>
                    <li v-for="{ product, quantity } in sellStore.packing.remainingProducts"
                        :key="product.id"
                        class="mb-4 font-bold">
                        <ProductDisplay :product="product" :quantity="quantity"/>
                    </li>
                </ul>
            </div>

            <button class="btn btn-primary w-full mt-2">
                Valider
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ProductDisplay from '@/components/session/checkout-modal/ProductDisplay.vue';
import { useSellStore } from '@/stores/sell';
import PackedSell from './PackedSell.vue';
import { currencyFormat } from '@/utils/currency';

const sellStore = useSellStore();

defineEmits<{
    (e: 'close'): void,
}>();

defineProps<{
    showCheckoutModal: boolean,
}>();
</script>
