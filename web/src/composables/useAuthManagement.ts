import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserStore, useUserStore } from '../stores/user';

export function useAuthManagement() {
    const userStore = useUserStore();
    const router = useRouter();

    const isAccountLoaded = ref(false);

    // Refresh the tokens every 14 mins if the user is logged in (tokens expire after 15 mins)
    // If the user is not logged in, the user will be redirected to the login page
    onMounted(async () => {
        const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 mins
        const REFRESH_TOKEN_TTL = 7 * 24 * 3600 * 1000 - 60 * 1000; // 7 days - 1 min
        let interval: number | null = null;

        // Retrieve the user from the local storage and set the user in the store
        const user = localStorage.getItem('user');
        if (user)
            userStore.$state = JSON.parse(user) as UserStore;

        // Update the localStorage each time the user state changes
        userStore.$subscribe((mutation, state) => {
            localStorage.setItem('user', JSON.stringify(state));
        });

        // If the refresh token is too old, logout the user. Just keep the email
        if (userStore.isLoggedIn && (userStore.refreshedAt! + REFRESH_TOKEN_TTL < Date.now()))
            disconnectUser();

        // If the user is logged in, refresh its token once and then set the interval to refresh it every 14 mins
        // Else, redirect the user to the login page
        if (userStore.isLoggedIn) {
            try {
                // Only refresh the token if it's more than 30s old
                if (userStore.refreshedAt! + 30 * 1000 < Date.now())
                    await userStore.refreshTokens();
                interval = setInterval(refreshTokens, REFRESH_INTERVAL);
            } catch (e) {
                console.error(e);
                disconnectUser();
                await router.push('/login');
            }
            isAccountLoaded.value = true;
        } else {
            isAccountLoaded.value = true;
            await router.push('/login');
        }

        // Updates the interval to refresh the tokens according to the user's login status
        userStore.$subscribe((mutation, state) => {
            if (state.isLoggedIn && interval === null) {
                interval = setInterval(refreshTokens, REFRESH_INTERVAL);
            } else if (!state.isLoggedIn && interval !== null) {
                clearInterval(interval);
                interval = null;
                router.push('/login');
            }
        });
    });

    function refreshTokens() {
        userStore.refreshTokens();
    }

    function disconnectUser() {
        const userEmail = userStore.email;
        userStore.$reset();
        userStore.email = userEmail;
    }

    return {
        isAccountLoaded,
    };
}