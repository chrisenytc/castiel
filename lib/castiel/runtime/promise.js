import Promise from 'bluebird'

[
	'fs',
	'crypto',
	'child_process',
	'dns',
	'http',
	'https',
	'net'
].forEach((module) => {
	Promise.promisifyAll(require(module));
});
