import { defineStore } from 'pinia';
import { handleGQLError, updateAuth } from '../api/client';
import { getInfo } from '../api/user/getInfo';
import { login } from '../api/user/login';
import { refreshTokens } from '../api/user/refreshTokens';
import { Nullable } from '../types/utils';

export interface UserStore {
    accessToken: string;
    refreshToken: string;
    refreshedAt: number;
    email: string;
    name: string;
    isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        refreshedAt: null,
        email: null,
        name: null,
        isLoggedIn: false,
    } as Nullable<UserStore>),
    actions: {
        async login(email: string, password: string) {
            try {
                // Get tokens
                const { auth_login } = await login(email, password);
                this.accessToken = auth_login.access_token;
                this.refreshToken = auth_login.refresh_token;
                this.refreshedAt = Date.now();
                // Update auth state of the GraphQL client with the new token
                this.applyTokens();
                // Get user info
                await this.getInfo();
                this.isLoggedIn = true;
            } catch (e) {
                throw handleGQLError(e);
            }
        },
        async getInfo() {
            try {
                const { users_me } = await getInfo();
                this.email = users_me.email;
                this.name = users_me.first_name;
            } catch (e) {
                throw handleGQLError(e);
            }
        },
        async refreshTokens() {
            if (!this.refreshToken || !this.isLoggedIn) {
                throw new Error('User is not logged in');
            }

            try {
                const { auth_refresh } = await refreshTokens(this.refreshToken);
                this.accessToken = auth_refresh.access_token;
                this.refreshToken = auth_refresh.refresh_token;
                this.refreshedAt = Date.now();
                // Update auth state of the GraphQL client with the new token
                this.applyTokens();
            } catch (e) {
                throw handleGQLError(e);
            }
        },
        applyTokens() {
            if (!this.accessToken)
                throw new Error('No access token');
            updateAuth(this.accessToken);
        },
    },
});
