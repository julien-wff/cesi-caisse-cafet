import { gql } from 'graphql-request';
import { GraphQLSystemClient } from '../client';

export function getInfo() {
    return GraphQLSystemClient.request<InfoResponse>(gql`
        query GetInfo {
            users_me {
                email
                first_name
            }
        }
    `);
}

export interface InfoResponse {
    users_me: {
        email: string;
        first_name: string;
    };
}
