'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ExpertClient = exports.DesignerClient = void 0
const client_1 = require('./designer/client')
Object.defineProperty(exports, 'DesignerClient', {
	enumerable: true,
	get: function () {
		return client_1.DesignerClient
	},
})
const client_2 = require('./expert/client')
Object.defineProperty(exports, 'ExpertClient', {
	enumerable: true,
	get: function () {
		return client_2.ExpertClient
	},
})
