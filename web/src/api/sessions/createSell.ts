import { GraphQLClient } from '@/api/client';
import { gql } from 'graphql-request';

export async function createSell(variables: CreateSellInput) {
    return GraphQLClient.request<CreateSellResponse>(
        gql`
            mutation CreateSell(
                $session_id: ID!
                $sell_revenue: Float!
                $sell_buy_price: Float!
                $sell_sell_price: Float!
                $products: [create_sell_product_input]!
                $opening_reduction: Boolean!
            ) {
                create_sell_item(
                    data: {
                        session: { id: $session_id }
                        revenue: $sell_revenue
                        buy_price: $sell_buy_price
                        sell_price: $sell_sell_price
                        products: $products
                        opening_reduction: $opening_reduction
                    }
                ) {
                    id
                }
            }
        `,
        {
            session_id: variables.sessionID,
            sell_revenue: variables.revenue,
            sell_buy_price: variables.buyPrice,
            sell_sell_price: variables.sellPrice,
            products: variables.products.map(product => ({
                product_id: {
                    id: product.productID,
                },
                quantity: product.quantity,
            })),
            opening_reduction: variables.openingReduction,
        },
    );
}

export interface CreateSellInput {
    sessionID: string;
    revenue: number;
    buyPrice: number;
    sellPrice: number;
    openingReduction: boolean;
    products: {
        productID: string;
        quantity: number;
    }[];
}

export interface CreateSellResponse {
    create_sell_item: {
        id: string;
    };
}
