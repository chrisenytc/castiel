export default class UnauthorizedError extends StandardError {
	constructor() {
		super('Not authorized to perform this action.')
	}
}
