import { GraphQLClient as Client } from 'graphql-request';

const endpoint = import.meta.env.VITE_API_ENDPOINT;

export const GraphQLClient = new Client(`${endpoint}/graphql`);
export const GraphQLSystemClient = new Client(`${endpoint}/graphql/system`);

export function updateAuth(token: string) {
    GraphQLClient.setHeader('Authorization', `Bearer ${token}`);
    GraphQLSystemClient.setHeader('Authorization', `Bearer ${token}`);
}
