import { gql, request } from 'graphql-request';
import { UserTokens } from '@/types/user';
import { ENDPOINT } from '../client';

export function login(email: string, password: string) {
    return request<LoginResponse>(
        `${ENDPOINT}/graphql/system`,
        gql`
            mutation Login($email: String!, $password: String!) {
                auth_login(email: $email, password: $password) {
                    access_token
                    refresh_token
                }
            }
        `,
        {
            email,
            password,
        },
    );
}

export type LoginResponse = {
    auth_login: UserTokens;
};
