import { defineStore } from 'pinia';
import { handleGQLError, updateAuth } from '../api/client';
import { getInfo } from '../api/user/getInfo';
import { login } from '../api/user/login';
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
        refreshedAt: Date.now(),
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
                updateAuth(this.accessToken);
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
    },
});
