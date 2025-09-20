import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		plugins: {
			react,
			'jsx-a11y': jsxA11y,
			'unused-imports': unusedImports,
		},
		rules: {
			// React rules (with modern React 17+ adjustments)
			...react.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off', // Not needed with React 17+
			'react/jsx-uses-react': 'off', // Not needed with React 17+
			'react/jsx-uses-vars': 'error',
			'react/jsx-no-target-blank': 'warn', // Make it a warning instead of error

			// JSX A11y rules (essential accessibility)
			...jsxA11y.configs.recommended.rules,

			// Unused imports rules
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
			],
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
]);
