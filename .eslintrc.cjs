/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'plugin:vue/vue3-strongly-recommended',
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'prettier',
	],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
		'vue/require-default-prop': 0,
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/singleline-html-element-content-newline': 0,
		'vue/component-name-in-template-casing': ['error', 'PascalCase'],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	},
	parserOptions: {
		ecmaVersion: 'latest',
	},
};
