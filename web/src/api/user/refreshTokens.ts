import { gql, request } from 'graphql-request';
import { UserTokens } from '@/types/user';
import { ENDPOINT } from '../client';

export function refreshTokens(refreshToken: string) {
    return request<RefreshResponse>(
        `${ENDPOINT}/graphql/system`,
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
