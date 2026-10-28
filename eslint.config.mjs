import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-plugin-react's version detection calls context.getFilename, which ESLint 10 removed.
    settings: { react: { version: '19.3' } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'import/no-default-export': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', '.preview/**', 'next-env.d.ts', 'playwright-report/**']),
])
