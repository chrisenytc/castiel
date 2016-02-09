import fs from 'fs'
import hpp from 'hpp'
import path from 'path'
import helmet from 'helmet'
import Castiel from 'castiel'
import express from 'express'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
import requestId from 'request-id/express'
import methodOverride from 'method-override'
import bunyanLogger from 'express-bunyan-logger'
import LoggerAdapter from 'castiel/adapters/logger'
import { respondNotFoundHandler, respondErrorHandler } from 'castiel/helpers/response'

const Logger = LoggerAdapter.createLogger({ name: 'APPLICATION' });

export default class Application {
	constructor() {
		Logger.info('Starting router.');
		this.router = express();
		Logger.info('Configuring middlewares.');
		this.configureMiddlewares();
		Logger.info('Loading custom middlewares.');
		this.registerMiddlewares();
		Logger.info('Loading endpoints.');
		this.registerEndpoints();
		// 404 Handler
		this.router.use((req, res, next) => {
			return res.status(404).json(respondNotFoundHandler(req, {message: 'Invalid URL.'}));
		});
		// 500 Handler
		this.router.use((err, req, res, next) => {
			Logger.error('An unhandled error ocurred on router:');
			Logger.error(err)
			
			return res.status(500).json(respondErrorHandler(req, err));
		});
	}

	initialize() {
		return Castiel.initialize();
	}

	registerEndpoints() {
		let base = path.join(__dirname, 'endpoints');
		let files = fs.readdirSync(base);

		for (let file of files) {
			let endpoint = path.join(base, file);
			let stat = fs.lstatSync(endpoint);

			if (stat.isFile()) {
				let cls = require(endpoint);

				cls.setup();

				this.registerEndpoint(cls);
			}
		}
	}

	registerMiddlewares() {
		// this.registerMiddleware(mdd);
	}

	registerEndpoint(endpoint) {
		this.router.use(endpoint.router);
	}

	registerMiddleware(middleware) {
		this.router.use(middleware);
	}

	configureMiddlewares() {
		this.router.enable('trust proxy');
		this.router.use(helmet());
		this.router.use(hpp());
		this.router.use(responseTime());
		this.router.use(requestId());
		this.router.use(bodyParser.json());
		this.router.use(bodyParser.urlencoded({ extended: true }));
		this.router.use(methodOverride());
		this.router.use(bunyanLogger());
	}
}
