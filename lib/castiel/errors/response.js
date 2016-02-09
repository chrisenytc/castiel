export default class ResponseError extends StandardError {
	constructor() {
		super('No response body.');
	}
}
