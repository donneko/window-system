import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["dist", "coverage", "docs", "node_modules", "package-lock.json", ".github"],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,

    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "no-console": "off",
            "prefer-const": "warn",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    }
);
