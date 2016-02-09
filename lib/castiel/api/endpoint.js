import _ from 'lodash'
import { join } from 'path'
import bunyan from 'bunyan'
import Castiel from 'castiel'
import Promise from 'bluebird'
import { Router } from 'express'
import { 
	response, 
	responseFor, 
	responseForError, 
	respondNotFound, 
	respondUnauthorized
} from 'castiel/helpers/response'

const ErrorResponses = {
	success: 200,
	created: 201,
	accepted: 202,
	no_content: 204,
	bad_request: 400,
	unauthorized: 401,
	internal_error: 500,
	not_found: 404
};

export default class Endpoint {
	static get router() {
		if (!this._router) {
			this._router = Router();
		}

		return this._router;
	}

	static get logger() {
		if (!this._logger) {
			this._logger = bunyan.createLogger({ name: 'ENDPOINT' });
		}

		return this._logger;
	}

	static use(...args) {
		this.router.use(...args);
	}

	static route(method, path, name, middlewares) {
		let middlewareStack = [];
		let constructor = this;

		if(typeof middlewares == 'string') {
			middlewareStack.push(require(join(__dirname, 'middlewares', middlewares)));
		} else if(middlewares instanceof Array) {
			for(let mdd of middlewares) {
				middlewareStack.push(require(join(__dirname, 'middlewares', mdd)));
			}
		}

		this.logger.info(`Endpoint ${method.toUpperCase()} ${path} created.`);

		this.router[method](path, middlewareStack, (req, res, next) => {
			let instance = new constructor(req, res);

			instance.dispatch(name);
		});
	}

	constructor(req, res) {
		this.req = req;
		this.res = res;
	}

	get context() {
		return this.req.context;
	}

	get logger() {
		return this.constructor.logger;
	}

	get params() {
		if (!this._params) {
			this._params = _.merge(this.req.query, this.req.body, this.req.params);
		}

		return this._params;
	}

	set params(params) {
		this._params = params;
	}

	dispatch(name, ...args) {
		return Promise.bind(this)
		.then(handle)
		.catch(NotFoundError, respondNotFound)
		.catch(UnauthorizedError, respondUnauthorized)
		.catch(handleError)
		.then(respond)
		.catch(respondError);

		function handle() {
			return this[name](...args);
		}

		function handleError(error) {
			let metadata = undefined;
			let message = 'An internal error ocurred.';

			this.logger.error('An unhandled error ocurred:');

			if (_.isObject(error)) {
				this.logger.error(error.name);
				this.logger.error(error.message);
				this.logger.error(error.stack);
			} else {
				this.logger.error(error);
			}

			if (_.isObject(error) && process.env.NODE_ENV != 'production') {
				message = error.message;

				metadata = {
					name: error.error,
					message: error.message,
					stack: error.stack
				}
			}

			return responseForError('internal_error', {
				type: 'internal_error',
				message: message,
				metadata: metadata
			});
		}

		function respond(result) {
			if(!result) {
				throw new ResponseError();
			}

			let status = result.status, response = {};

			return Promise.bind(this)
			.then(simple)
			.then(responder)
			.then(merge)
			.then(send);

			function simple() {
				if (result.errors) {
					status = status || 'internal_error';

					_.merge(response, {
						url: this.req.url,
						method: this.req.method.toLowerCase(),
						errors: result.errors
					});
				} else if (result.response) {
					_.merge(response, result.response);
				}

				if (result.metadata) {
					_.merge(response, result.metadata);
				}
			}

			function responder() {
				if (result.object) {
					if(typeof Castiel.responders[result.responder] == 'function') {
						return Castiel.responders[result.responder](result.object, this.context);
					}
				}
			}

			function merge(object) {
				_.merge(response, object);
			}

			function send() {
				this.res.status(ErrorResponses[status || 'success'] || 200);
				this.res.json(response);
			}
		}

		function respondError(error) {
			let metadata = undefined;
			let message = 'An internal error ocurred.';

			this.logger.error('An unhandled error ocurred:');

			if (_.isObject(error)) {
				this.logger.error(error.name);
				this.logger.error(error.message);
				this.logger.error(error.stack);
			} else {
				this.logger.error(error);
			}

			if (_.isObject(error) && process.env.NODE_ENV != 'production') {
				message = error.message;

				metadata = {
					name: error.error,
					message: error.message,
					stack: error.stack
				}
			}

			let response = responseForError('internal_error', {
				type: 'internal_error',
				message: message,
				metadata: metadata
			});

			_.merge(response, {
				url: this.req.url,
				method: this.req.method.toLowerCase(),
				errors: errors.errors
			});

			this.res.status(ErrorResponses['internal_error']);
			this.res.json(response);
		}
	}
}
