'use strict';

require('babel/register')({
	ignore: /node_modules/,
	optional: [
		'runtime'
	]
});

require('nbundler/setup');
require('castiel/runtime/promise');
require('castiel/errors');
