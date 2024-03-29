module.exports = {
	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
	//collectCoverage: true,
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
