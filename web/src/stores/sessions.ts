import { defineStore } from 'pinia';
import { handleGQLError } from '../api/client';
import { getSessions, Session } from '../api/sessions/getSessions';

export const useSessionsStore = defineStore('sessions', {
    state: () => ({
        sessions: [] as Session[],
        currentSession: null as Session | null,
    }),
    getters: {
        lastSession(state): Session | null {
            return state.sessions[0];
        },
    },
    actions: {
        async fetchSessions(limit = 10) {
            try {
                const { sessions } = await getSessions({ sort: [ '-date_created' ], limit });
                this.sessions = sessions;
            } catch (e) {
                throw handleGQLError(e);
            }
        },
    },
});
