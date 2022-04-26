import { GraphQLClient } from '@/api/client';
import { gql } from 'graphql-request';

export async function createSell(variables: CreateSellInput) {
    const { sessions_by_id: session } = await GraphQLClient.request<GetSessionRevenuesResponse>(
        gql`
            query GetSessionRevenues ($session_id: ID!){
                sessions_by_id(id: $session_id) {
                    revenue
                    sell_price
                    buy_price
                }
            }
        `,
        {
            session_id: variables.sessionID,
        });

    return GraphQLClient.request<CreateSellResponse>(
        gql`
            mutation CreateSell(
                $session_id: ID!
                $sell_revenue: Float!
                $sell_buy_price: Float!
                $sell_sell_price: Float!
                $products: [create_sell_product_input]!
                $packs: [create_sell_pack_input]!
                $session_revenue: Float!
                $session_buy_price: Float!
                $session_sell_price: Float!
            ) {
                create_sell_item(
                    data: {
                        session: { id: $session_id }
                        revenue: $sell_revenue
                        buy_price: $sell_buy_price
                        sell_price: $sell_sell_price
                        products: $products
                        packs: $packs
                    }
                ) {
                    id
                }
                update_sessions_item(
                    id: $session_id
                    data: {
                        revenue: $session_revenue
                        buy_price: $session_buy_price
                        sell_price: $session_sell_price
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
            packs: variables.packs.map(pack => ({
                pack_id: {
                    id: pack.packID,
                },
                quantity: pack.quantity,
            })),
            session_revenue: session.revenue + variables.revenue,
            session_buy_price: session.buy_price + variables.buyPrice,
            session_sell_price: session.sell_price + variables.sellPrice,
        },
    );
}

export interface CreateSellInput {
    sessionID: string;
    revenue: number;
    buyPrice: number;
    sellPrice: number;
    products: {
        productID: string;
        quantity: number;
    }[];
    packs: {
        packID: string;
        quantity: number;
    }[];
}

export interface GetSessionRevenuesResponse {
    sessions_by_id: {
        revenue: number
        sell_price: number
        buy_price: number
    };
}

export interface CreateSellResponse {
    create_sell_item: {
        id: string;
    };
    update_sessions_item: {
        id: string;
    };
}
