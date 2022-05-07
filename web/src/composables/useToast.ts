import Toastify from 'toastify-js';

export function useToast() {

    function error(message: string, options: Toastify.Options = {}) {
        Toastify({
            text: message,
            className: 'rounded-lg bg-none bg-error',
            duration: 5000,
            close: true,
            ...options,
        }).showToast();
    }

    return { error };
}
