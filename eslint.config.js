import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  {
    files: ['packages/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: ['packages/integration/**/*.ts'],
    rules: {
      'jest/no-disabled-tests': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
    },
  },
  {
    files: ['packages/csv-worker/src/parts/GetCsvVirtualDom/GetCsvVirtualDom.ts'],
    rules: {
      'virtual-dom/no-inline-style': 'off',
      'virtual-dom/no-object-attribute-values': 'off',
    },
  },
])
