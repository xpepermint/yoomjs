'use strict';

/**
 * Module dependencies.
 */

let argv = require('yargs').argv;

/**
 * Process configuration. Make sure that the variables are synchronized with
 * command-line variables defined in `bin/yoom.js`.
 */

// Process environment.
process.env.YOOM_ENV = process.env.NODE_ENV = argv.e || argv.environment || process.env.YOOM_ENV || process.env.NODE_ENV || 'development';
// Port of the HTTP server.
process.env.YOOM_HTTP_PORT = argv.p || argv.port || process.env.YOOM_HTTP_HOST || '3000';
// Address of the HTTP server.
process.env.YOOM_HTTP_ADDRESS = argv.i || argv.address || process.env.YOOM_HTTP_ADDRESS || 'localhost';
// Application secret (cookie encription).
process.env.YOOM_SECRET = argv.s || argv.secret || process.env.YOOM_SECRET || 'no-secret';
