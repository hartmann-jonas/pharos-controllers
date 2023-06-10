import { DesignerClient } from './designer/client'
import { ExpertClient } from './expert/client'

export { DesignerClient, ExpertClient }

// remove console.log's in production
if (process.env.NODE_ENV === 'production') {
	console.log = function () {}
	console.error = function () {}
}
