import { gql } from 'graphql-request';
import { Session, SessionSort } from '../../types/session';
import { GraphQLClient } from '../client';

export function getSessions({
                                limit: limit = 10,
                                sort: sort = 'id' as SessionSort | SessionSort[],
                            } = {}) {
    return GraphQLClient.request<SessionsResponse>(gql`
                query GetSessions ($limit: Int, $sort: [String]) {
                    sessions (limit: $limit, sort: $sort) {
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
        `,
        { limit, sort: Array.isArray(sort) ? sort : [ sort ] },
    )
        // Converts the dates to Date objects
    .then((res) => ({
        ...res,
        sessions: res.sessions.map(session => ({
                ...session,
                date_created: session.date_created && new Date(session.date_created),
                date_updated: session.date_updated && new Date(session.date_updated),
            }),
        ),
    }));
}

export type SessionsResponse = {
    sessions: Session[];
};
