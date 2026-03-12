export default [
    {
        // Кажемо лінтеру ігнорувати ці автозгенеровані папки
        ignores: ["coverage/**", "dist/**", "node_modules/**"]
    },
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "off"
        }
    }
];