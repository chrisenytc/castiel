import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import Promise from 'bluebird'
import LoggerAdapter from 'castiel/adapters/logger'
import ComponentsAdapter from 'castiel/adapters/components'

const Logger = LoggerAdapter.createLogger({ name: 'INITIALIZER' });

export default {
	config: {},
	handlers: {},
	responders: {},

	initialize() {
		this.loadConfigs();
		return this.loadAdapters();
	},

	loadConfigs() {
		Logger.info('Loading configs.');
		// Get config file
		let defaultConfig = require(path.join(process.cwd(), 'config', 'default'));

		// Merge default config file with environment config file
		_.merge(defaultConfig, require(path.join(process.cwd(), 'config', process.env.NODE_ENV || 'default')));

		// Merge config file with application config
		_.merge(this.config, defaultConfig);
		Logger.info('All configs loaded successfully.');
	},

	loadAdapters() {
		// Initialize adapters
		return Promise.bind(this)
		.then(λ => {
			return Logger.info('Loading adapters.');
		})
		.then(λ => {
			Logger.info('Loading logger adapter.');
			return LoggerAdapter.initialize();
		})
		.then(λ => {
			Logger.info('Loading components adapter.');
			return ComponentsAdapter.initialize(this.responders);
		})
		.then(λ => {
			return Logger.info('All adapters loaded successfully.');
		});
	},

	when(event, handler) {
		if (!this.handlers[event]) {
			this.handlers[event] = [];
		}

		this.handlers[event].push(handler);
	},

	invokeHandlers(event) {
		return Promise.each(this.handlers[event] || [], handler => {
			return new Promise(resolve => {
				let result = handler(resolve);

				if (result && result.then) {
					result.then(resolve, resolve);
				}
			});
		});
	},

	teardown() {
		return invokeHandlers('teardown');
	}
}
