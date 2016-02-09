import http from 'http'

export default class Server {
	constructor(app, options) {
		this.options = options;
		this.server = http.createServer(app.router);
	}

	run() {
		return this.server.listenAsync(this.options.port, this.options.bind);
	}
}
