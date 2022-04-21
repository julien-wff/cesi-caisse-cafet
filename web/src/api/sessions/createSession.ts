import { gql } from 'graphql-request';
import { GraphQLClient } from '../client';
import { Session } from './getSessions';

export function createSession(): Promise<CreateSessionResponse> {
    return GraphQLClient.request<CreateSessionResponse>(gql`
        mutation CreateSession {
            create_sessions_item(data: {}) {
                id
                date_created
                user_created {
                    id
                    first_name
                    email
                }
                date_updated
                user_updated {
                    id
                    first_name
                    email
                }
            }
        }
    `)
        //Converts the dates to Date objects
    .then((res) => ({
        ...res,
        create_sessions_item: {
            ...res.create_sessions_item,
            date_created: res.create_sessions_item.date_created && new Date(res.create_sessions_item.date_created),
            date_updated: res.create_sessions_item.date_updated && new Date(res.create_sessions_item.date_updated),
        },
    }));
}

type CreateSessionResponse = {
    create_sessions_item: Session;
};
