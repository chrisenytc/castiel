import Endpoint from 'castiel/api/endpoint'
import StatusService from 'castiel/components/status/service'

export default class StatusEndpoint extends Endpoint {
	static setup() {
		this.route('all', '/status', 'index');
	}

	get service() {
		return StatusService.withContext(this.context);
	}

	index() {
		return this.service.get(this.params);
	}
}
