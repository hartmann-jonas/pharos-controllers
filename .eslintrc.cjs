/* eslint-env node */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'eslint-config-prettier'],
	env: {
		node: true,
		es6: true,
	},
	overrides: [
		{
			files: ['**/*.ts'],
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'eslint-config-prettier',
			],
			env: {
				node: true,
			},
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint'],
		},
	],
}
