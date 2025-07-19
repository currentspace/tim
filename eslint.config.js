import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  // Ignore build outputs and dependencies
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
      '*.config.d.ts',
      'src/vite-env.d.ts',
    ],
  },

  // Base JS recommended
  eslint.configs.recommended,

  // TypeScript recommended (type-aware rules)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // React 19 recommended flat configs (includes JSX runtime rules)
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  // React Hooks recommended rules
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // React Refresh recommended (optional, for Fast Refresh setups)
  reactRefresh.configs.recommended,

  // Custom rules & overrides
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true, // type-aware linting requires a tsconfig.json
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser, // standard browser globals
      },
    },
    rules: {
      // React-specific overrides
      'react/react-in-jsx-scope': 'off', // Not needed with JSX runtime
      'react/prop-types': 'off', // TS handles props validation

      // Allow custom JSX props (e.g., for canvas or special libraries)
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'args',
            'rotation',
            'anchor',
            'scale',
            'draw',
            'texture',
            'text',
            'style',
            'jsx',
          ],
        },
      ],

      // TypeScript overrides
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Console logs allowed for warnings/errors only
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier (turn off conflicting style rules, must be last)
  prettier,
)
