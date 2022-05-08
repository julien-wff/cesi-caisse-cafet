import { createSell } from '@/api/sessions/createSell';
import { useToast } from '@/composables/useToast';
import { useProductStore } from '@/stores/product';
import { useSessionsStore } from '@/stores/sessions';
import { roundMoney } from '@/utils/roundMoney';
import { defineStore } from 'pinia';
import { handleGQLError } from '@/api/client';
import { getPacks } from '@/api/packs/getPacks';
import { useProductPacking } from '@/composables/useProductPacking';
import { Pack } from '@/types/pack';
import { Product } from '@/types/product';

export interface SellProduct {
    product: Product;
    quantity: number;
}

export const useSellStore = defineStore('sell', {
    state: () => ({
        cart: [] as SellProduct[],
        packs: [] as Pack[],
    }),
    getters: {
        totalPrice(): number {
            const { packedSells, remainingProducts } = this.packing;
            const packedSellsPrice = packedSells.reduce((total, sell) => total + sell.price, 0);
            const remainingProductsPrice = remainingProducts.reduce(
                (total, { product, quantity }) => total + product.sell_price * quantity,
                0,
            );
            return roundMoney(packedSellsPrice + remainingProductsPrice);
        },
        buyPrice(store) {
            return roundMoney(
                store.cart.reduce((total, { product, quantity }) => total + product.buy_price * quantity, 0),
            );
        },
        revenue(): number {
            return roundMoney(this.totalPrice - this.buyPrice);
        },
        itemsCount(store) {
            return store.cart.reduce((total, { quantity }) => total + quantity, 0);
        },
        productCount(store) {
            return (product: Product) => {
                return store.cart.find(({ product: p }) => p.id === product.id)?.quantity || 0;
            };
        },
        packing(store) {
            return useProductPacking(store.cart, store.packs);
        },
    },
    actions: {
        async fetchPacks() {
            try {
                const { pack } = await getPacks();
                this.packs = pack;
            } catch (e) {
                throw handleGQLError(e);
            }
        },
        addToCart(product: Product, quantity = 1) {
            this.cart.push({ product, quantity });
        },
        removeFromCart(product: Product) {
            this.cart = this.cart.filter(({ product: p }) => p.id !== product.id);
        },
        addQuantity(product: Product, quantity: number) {
            const index = this.cart.findIndex(({ product: p }) => p.id === product.id);
            if (index === -1)
                return;
            const newQuantity = this.cart[index].quantity + quantity;
            if (newQuantity <= 0)
                this.removeFromCart(product);
            else
                this.cart[index].quantity = newQuantity;
        },
        async confirmSell() {
            const sessionStore = useSessionsStore();
            const productStore = useProductStore();
            const toast = useToast();

            // Aggregate packs
            const packs = this.packing.packedSells.reduce((acc, { pack }) => {
                const packIndex = acc.findIndex(p => p.packID === pack.id);
                if (packIndex === -1)
                    acc.push({ packID: pack.id, quantity: 1 });
                else
                    acc[packIndex].quantity++;
                return acc;
            }, [] as { packID: string, quantity: number }[]);

            try {
                const { productsStock } = await createSell({
                    sessionID: sessionStore.currentSession!.id,
                    revenue: this.revenue,
                    buyPrice: this.buyPrice,
                    sellPrice: this.totalPrice,
                    products: this.cart.map(({ product, quantity }) => ({
                        productID: product.id,
                        quantity,
                    })),
                    packs,
                });
                // Update the products stock
                for (const { id, stock } of productsStock) {
                    productStore.updateStock(id, stock);
                }
                // Reset the cart
                this.cart = [];
                toast.success('Vente ok !', { duration: 1500 });
            } catch (e) {
                throw handleGQLError(e);
            }
        },
    },
});
