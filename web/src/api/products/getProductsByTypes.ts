import { gql } from 'graphql-request';
import { ProductType } from '@/types/product';
import { GraphQLClient } from '../client';

export function getProductsByTypes() {
    return GraphQLClient.request<GetProductsByCategoriesResponse>(gql`
        query GetProductsByCategory {
            product_type (filter: {product: {status: {_eq: "available"}}}, sort: ["name"]) {
                id
                name
                product(filter: { status: {_eq: "available"} }, sort: ["name"]) {
                    id
                    status
                    name
                    product_type {
                        id
                        name
                    }
                    buy_price
                    sell_price
                    thumbnail {
                        id
                        height
                        width
                    }
                    stock_management_enabled
                    stock
                }
            }
        }
    `)
        // Filter out empty types
    .then(types => ({
        ...types,
        product_type: types.product_type.filter(type => type.product.length > 0),
    }));
}

export type GetProductsByCategoriesResponse = {
    product_type: ProductType[];
};
