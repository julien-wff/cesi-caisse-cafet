import { defineStore } from 'pinia';
import { handleGQLError } from '../api/client';
import { createSession } from '../api/sessions/createSession';
import { getSessions } from '../api/sessions/getSessions';
import { Session } from '../types/session';

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
        async createSession() {
            try {
                const { create_sessions_item } = await createSession();
                this.sessions.unshift(create_sessions_item);
                this.currentSession = create_sessions_item;
            } catch (e) {
                throw handleGQLError(e);
            }
        },
        selectLastSession() {
            this.currentSession = this.lastSession;
        },
    },
});
