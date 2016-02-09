export default class StandardError extends Error {
	constructor(message) {
		super();

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = new Error().stack;
		}

		this.name = this.constructor.name;
		this.message = message;
	}
}
