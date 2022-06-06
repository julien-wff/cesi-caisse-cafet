import { createSell } from '@/api/sessions/createSell';
import { useToast } from '@/composables/useToast';
import { useProductStore } from '@/stores/product';
import { useSessionsStore } from '@/stores/sessions';
import { roundMoney } from '@/utils/roundMoney';
import { defineStore } from 'pinia';
import { handleGQLError } from '@/api/client';
import { Product } from '@/types/product';

export interface SellProduct {
    product: Product;
    quantity: number;
}

export const DISCOUNT_VALUE = .2;

export const useSellStore = defineStore('sell', {
    state: () => ({
        cart: [] as SellProduct[],
    }),
    getters: {
        totalPrice(): number {
            return roundMoney(
                this.cart.reduce(
                    (total, { product, quantity }) => total + product.sell_price * quantity,
                    0,
                ) - this.discount,
            );
        },
        buyPrice(store) {
            return roundMoney(
                store.cart.reduce((total, { product, quantity }) => total + product.buy_price * quantity, 0),
            );
        },
        revenue(): number {
            return roundMoney(this.totalPrice - this.buyPrice);
        },
        discount(): number {
            return this.packCount * DISCOUNT_VALUE;
        },
        packCount(): number {
            return Math.floor(this.itemsCount / 2);
        },
        itemsCount(store) {
            return store.cart.reduce((total, { quantity }) => total + quantity, 0);
        },
        productCount(store) {
            return (product: Product) => {
                return store.cart.find(({ product: p }) => p.id === product.id)?.quantity || 0;
            };
        },
    },
    actions: {
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
        async confirmSell(openingReduction = false) {
            const sessionStore = useSessionsStore();
            const productStore = useProductStore();
            const toast = useToast();

            // If there is an opening reduction, we lose the price of the products and the sell price is 0
            const revenue = openingReduction ? -this.buyPrice : this.revenue;
            const sellPrice = openingReduction ? 0 : this.totalPrice;

            try {
                const { productsStock } = await createSell({
                    sessionID: sessionStore.currentSession!.id,
                    revenue,
                    buyPrice: this.buyPrice,
                    sellPrice,
                    products: this.cart.map(({ product, quantity }) => ({
                        productID: product.id,
                        quantity,
                    })),
                    openingReduction,
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
