import { gql } from 'graphql-request';
import { UserInfo } from '../../types/user';
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

export type InfoResponse = {
    users_me: UserInfo;
};
