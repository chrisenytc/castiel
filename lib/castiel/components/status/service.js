import Service from 'castiel/service'

export default class StatusService extends Service {
	static get(params) {
		return this.respond(params, 'status');
	}
}
