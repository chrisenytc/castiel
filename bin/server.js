#!/usr/bin/env node

require('../lib/bootstrap');
require('castiel/cli/server')(new (require('castiel/api/application'))());
