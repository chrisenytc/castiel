import Castiel from 'castiel'

export default (model, context) => {
	return {
		status: 'ok',
		environment: Castiel.config.environment,
		date: new Date()
	}
}
