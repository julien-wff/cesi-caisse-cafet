import { ENDPOINT } from '@/api/client';
import { useUserStore } from '@/stores/user';

export function postDiscordMessage() {
    const userStore = useUserStore();

    return fetch(`${ENDPOINT}/discord`, {
        headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
        },
    })
        .then(res => {
            if (!res.ok)
                throw new Error(`${res.status} ${res.statusText}`);
            return res;
        });
}