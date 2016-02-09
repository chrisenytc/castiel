export default class NotFoundError extends StandardError {
	constructor(modelName) {
		super(`${modelName} not found.`);
	}
}
