import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
    ],
    rules: {
      // Allow apostrophes in JSX without escaping
      "react/no-unescaped-entities": "warn",
      // Allow unused variables (common in development)
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow explicit any types (needed for external libraries)
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow missing dependencies in useEffect
      "react-hooks/exhaustive-deps": "warn",
      // Allow img tags instead of Next.js Image
      "@next/next/no-img-element": "warn",
      // Allow anonymous default exports
      "import/no-anonymous-default-export": "warn",
    },
  },
];

export default eslintConfig;
