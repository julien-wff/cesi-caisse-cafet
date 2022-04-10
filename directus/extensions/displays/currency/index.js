export default {
    id: 'currency',
    name: 'Currency',
    icon: 'monetization_on',
    description: 'Display a currency value',
    component: function ({ value }) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    },
    options: null,
    types: ['integer', 'float', 'decimal'],
};
