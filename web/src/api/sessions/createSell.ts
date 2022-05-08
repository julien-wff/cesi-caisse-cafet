import { GraphQLClient } from '@/api/client';
import { gql } from 'graphql-request';

export async function createSell(variables: CreateSellInput) {
    const {
        sessions_by_id: session,
        product: productsStock,
    } = await GraphQLClient.request<GetInformationForSellResponse>(
        gql`
            query GetInformationForSell ($session_id: ID!, $products_id: [Float]!) {
                sessions_by_id(id: $session_id) {
                    revenue
                    sell_price
                    buy_price
                }
                product(filter: {id: {_in: $products_id}}) {
                    id
                    stock_management_enabled
                    stock
                }
            }
        `,
        {
            session_id: variables.sessionID,
            products_id: variables.products.map(product => parseInt(product.productID)),
        });

    // Build the list of products to update the stock and get the new stock according to the buy quantity
    const newProductCount = productsStock
        .filter(product => product.stock_management_enabled)
        .map(pr => ({
            id: pr.id,
            stock: pr.stock - (variables.products.find(product => product.productID === pr.id)?.quantity || 0),
        }));

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
                ${newProductCount.map(product => `
                    product_update_${product.id}: update_product_item(
                        id: ${product.id}
                        data: { stock: ${product.stock} }
                    ) {
                        id
                        stock
                    }
                `)}
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
    )
    .then(response => ({
        ...response,
        productsStock: Object
            .keys(response)
            .filter(key => key.startsWith('product_update_'))
            // @ts-ignore - TS doesn't know about the product updates
            .reduce((acc, key) => [ ...acc, response[key] ], [] as UpdatedProduct[]),
    }));
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

export interface GetInformationForSellResponse {
    sessions_by_id: {
        revenue: number
        sell_price: number
        buy_price: number
    };
    product: {
        id: string
        stock_management_enabled: boolean
        stock: number
    }[];
}

export interface CreateSellResponse {
    create_sell_item: {
        id: string;
    };
    update_sessions_item: {
        id: string;
    };
}

export interface UpdatedProduct {
    id: string;
    stock: number;
}
