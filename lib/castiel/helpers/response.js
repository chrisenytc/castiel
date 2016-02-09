import _ from 'lodash'

export function mapModel(model, response) {
	if(model instanceof Array) {
		return _.map(model, (val) => {
			return response(val);
		});
	}

	return response(model);
}

export function response(status, response) {
	return {
		status: status,
		response: response
	};
}

export function responseFor(status, object, metadata = {}) {
	return {
		status: status,
		object: object,
		metadata: metadata
	};
}

export function responseForError(status, errors, metadata = {}) {
	return {
		status: status,
		errors: Array.of(errors),
		metadata: metadata
	};
}

export function respondWithResponder(id, model, metadata = {}) {
	return {
		responder: id,
		object: model,
		metadata: metadata
	};
}

export function respondNotFoundHandler(req, err) {
	return {
		url: req.url,
		method: req.method.toLowerCase(),
		errors: Array.of({
			type: 'not_found',
			message: err.message
		})
	};
}

export function respondErrorHandler(req, err) {
	return {
		url: req.url,
		method: req.method.toLowerCase(),
		errors: Array.of({
			type: 'internal_error',
			message: err.message
		})
	};
}

export function respondNotFound(err) {
	return responseForError('not_found', {
		type: 'not_found',
		message: err.message
	});
}

export function respondUnauthorized(err) {
	return responseForError('unauthorized', {
		type: 'unauthorized',
		message: 'Access denied.'
	});
}
