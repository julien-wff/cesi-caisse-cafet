<template>
    <div class="center">
        <div class="card card-body bg-base-100 max-w-lg m-4">
            <h2 class="mb-4">Connexion</h2>
            <form @submit.prevent="handleFormSubmit">
                <label class="label label-text" for="email-input">Email</label>
                <input id="email-input"
                       v-model="email"
                       :disabled="loading"
                       class="input input-primary w-full mb-4"
                       required
                       type="email">

                <label class="label label-text" for="password-input">Mot de passe</label>
                <input id="password-input"
                       v-model="password"
                       :disabled="loading"
                       class="input input-primary w-full"
                       required
                       type="password">

                <p v-if="error" class="mt-4 text-error font-bold">{{ error }}</p>

                <button :disabled="loading" class="btn btn-primary w-full mt-8" type="submit">Se connecter</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const router = useRouter();

// Redirect to the home page if the user is already logged in
onMounted(() => {
    if (userStore.isLoggedIn) {
        router.push('/');
    }
});

const loading = ref(false);
const error = ref<string | null>(null);

const email = ref('');
const password = ref('');

async function handleFormSubmit() {
    loading.value = true;
    error.value = null;

    try {
        await userStore.login(email.value, password.value);
        await router.push('/');
    } catch (e) {
        handleLoginError((e as Error)?.message || 'Une erreur est survenue');
    } finally {
        loading.value = false;
    }
}

function handleLoginError(err: string) {
    error.value = err;
    password.value = '';
}
</script>
