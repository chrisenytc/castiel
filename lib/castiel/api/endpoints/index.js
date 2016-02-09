import Endpoint from 'castiel/api/endpoint'

export default class IndexEndpoint extends Endpoint {
	static setup() {
		this.route('get', '/', 'index');
	}

	index() {
		return {
			status: 'ok',
			response: {
				welcome: 'Welcome to Castiel Framework'
			}
		};
	}
}
