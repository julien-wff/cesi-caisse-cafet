import type { HookConfig } from '@types';

interface Product {
    product_id: {
        id: number;
    };
    quantity: number;
}

export default (({ action }) => {
    action('sell.items.create', async ({ payload }, context) => {
        await Promise.all([
            // Update session info
            context
                .database('sessions')
                .where('id', payload.session.id)
                .increment('revenue', payload.revenue)
                .increment('buy_price', payload.buy_price)
                .increment('sell_price', payload.sell_price),

            // Update product stock if the stock management is enabled
            ...payload.products.map((product: Product) => context
                .database('product')
                .where('id', product.product_id.id)
                .select('stock_management_enabled')
                .then(rows =>
                    rows[0]?.stock_management_enabled
                    && context
                        .database('product')
                        .where('id', product.product_id.id)
                        .decrement('stock', product.quantity),
                ),
            ),
        ]);
    });
}) as HookConfig;
