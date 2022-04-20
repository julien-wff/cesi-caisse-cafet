<template>
    <div class="center">
        <div class="card card-body bg-base-100 max-w-lg m-4">
            <h2 class="mb-4">Connexion</h2>
            <form @submit.prevent="handleFormSubmit">
                <label class="label label-text" for="email-input">Email</label>
                <input id="email-input"
                       v-model="credentials.email"
                       :disabled="loading"
                       class="input input-primary w-full mb-4"
                       required
                       type="email">

                <label class="label label-text" for="password-input">Mot de passe</label>
                <input id="password-input"
                       v-model="credentials.password"
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
import { reactive, ref } from 'vue';

const loading = ref(false);
const error = ref<string | null>(null);

const credentials = reactive({
    email: '',
    password: '',
});

function handleFormSubmit() {
    loading.value = true;
    error.value = null;
}

function handleLoginError(err: string) {
    error.value = err;
    credentials.password = '';
}
</script>
