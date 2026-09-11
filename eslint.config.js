import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import globals from "globals";

const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/next-env.d.ts",
      "packages/**/templates/**",
    ],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.js"],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    settings: {
      next: { rootDir: "web/" },
      react: { version: "19.0" },
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-control-regex": "off",
    },
  },
];

export default eslintConfig;
