import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  // Tell ESLint to completely skip compiled build files
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // 1. Base JavaScript configuration & browser environment rules
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
  },

  // 2. Core recommended rules for JS
  js.configs.recommended,

  // 3. Recommended TypeScript configurations
  ...tseslint.configs.recommended,

  // 4. Prettier integration with your custom rules overrides
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": [
        "warn",
        {
          trailingComma: "es5",
          singleQuote: true,
          semi: false,
          endOfLine: "auto", // Fixes the Delete ␍ (CRLF) errors on Windows
        },
      ],
    },
  },
);
