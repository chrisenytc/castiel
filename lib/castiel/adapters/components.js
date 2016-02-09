import _ from 'lodash'
import LoggerAdapter from 'castiel/adapters/logger'
import statusComponent from 'castiel/components/status'

const Logger = LoggerAdapter.createLogger({ name: 'COMPONENT' });

export default {
	initialize(responders) {
		Logger.info('Loading responders.');
		this.loadResponders(responders);
	},

	loadResponders(responders) {
		responders['status'] = statusComponent.responder;
	}
}
