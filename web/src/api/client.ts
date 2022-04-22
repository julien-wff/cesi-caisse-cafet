import { ClientError, GraphQLClient as Client } from 'graphql-request';

export const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const GraphQLClient = new Client(`${ENDPOINT}/graphql`);
export const GraphQLSystemClient = new Client(`${ENDPOINT}/graphql/system`);

export function updateAuth(token: string) {
    GraphQLClient.setHeader('Authorization', `Bearer ${token}`);
    GraphQLSystemClient.setHeader('Authorization', `Bearer ${token}`);
}

export function handleGQLError(err: any) {
    let errorMessage = 'Une erreur est survenue.';

    if (err instanceof ClientError)
        errorMessage = err.response.errors?.[0].message || errorMessage;
    else if (err instanceof Error)
        errorMessage = err.message || errorMessage;
    else if (typeof err === 'string')
        errorMessage = err || errorMessage;
    else
        errorMessage = err?.toString() || JSON.stringify(err) || errorMessage;

    return new Error(errorMessage);
}
