const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  // Expo base (NO lo quites)
  expoConfig,

  // TypeScript rules con type-checking
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: true, // usa tu tsconfig.json
      },
    },
    rules: {
      // 🚫 evita: value || default cuando value puede ser false
      "@typescript-eslint/prefer-nullish-coalescing": "error",

      // 🛡️ fuerza checks explícitos
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        {
          allowString: true,
          allowNullableBoolean: true,
          allowNumber: false,
        },
      ],
    },
  },

  {
    ignores: ["dist/*"],
  },
]);
