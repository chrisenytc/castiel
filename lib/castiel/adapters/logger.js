import bunyan from 'bunyan'

export default {
	initialize() {
	},

	createLogger(opts) {
		return bunyan.createLogger(opts);
	}
}
