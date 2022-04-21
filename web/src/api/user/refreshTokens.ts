import { gql } from 'graphql-request';
import { UserTokens } from '../../types/user';
import { GraphQLSystemClient } from '../client';

export function refreshTokens(refreshToken: string) {
    return GraphQLSystemClient.request<RefreshResponse>(
        gql`
            mutation RefreshTokens($refreshToken: String!) {
                auth_refresh(refresh_token: $refreshToken, mode: json) {
                    access_token
                    refresh_token
                }
            }
        `,
        {
            refreshToken,
        },
    );
}

export type RefreshResponse = {
    auth_refresh: UserTokens;
}
