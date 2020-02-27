module.exports = {
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        'plugin:vue/recommended',
        '@vue/typescript'
    ],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
        'vue/max-attributes-per-line': 0,
        'vue/html-indent': ['error', 4],
        'object-curly-spacing': ['error', 'always']
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    plugins: ['@typescript-eslint'],
};
