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
    files: ['packages/extension/src/parts/{CreateInstance,Main}/**/*.ts'],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: ['packages/extension/src/parts/RenderCsv/RenderCsv.ts'],
    rules: {
      'virtual-dom/no-inline-style': 'off',
      'virtual-dom/no-object-attribute-values': 'off',
      'virtual-dom/valid-child-count': 'off',
    },
  },
])
