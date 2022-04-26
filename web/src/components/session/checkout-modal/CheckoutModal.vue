<template>
    <div :class="{'modal': true, 'modal-open': showCheckoutModal}" @click.self="!loading && $emit('close')">
        <div class="modal-box relative">
            <div class="btn btn-sm btn-circle absolute right-2 top-2" @click="!loading && $emit('close')">✕</div>
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

            <p v-if="error" class="my-4 text-error font-bold">{{ error }}</p>

            <button :disabled="loading" class="btn btn-primary w-full mt-2" @click="handleValidatingClick">
                Valider
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ProductDisplay from '@/components/session/checkout-modal/ProductDisplay.vue';
import { useSellStore } from '@/stores/sell';
import { ref, watch } from 'vue';
import PackedSell from './PackedSell.vue';
import { currencyFormat } from '@/utils/currency';

const sellStore = useSellStore();

const loading = ref(false);
const error = ref<string | null>(null);

const emit = defineEmits<{
    (e: 'close'): void,
}>();

const props = defineProps<{
    showCheckoutModal: boolean,
}>();

function handleValidatingClick() {
    loading.value = true;
    error.value = null;
    sellStore.confirmSell()
        .then(() => emit('close'))
        .catch(e => error.value = e.message)
        .finally(() => loading.value = false);
}

// Reset the error message when opening the modal
watch(props, () => {
    if (props.showCheckoutModal && error.value)
        error.value = null;
});
</script>
