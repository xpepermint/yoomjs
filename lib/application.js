'use strict';

/**
 * Module dependencies.
 */

let argv = require('yargs').argv;
let util = require("util");
let settings = require('./settings');
let renderers = require('./renderers');
let renderer = require('./middlewares/renderer');
let params = require('./middlewares/params');
let accessibility = require('./middlewares/accessibility');
let routes = require('./middlewares/routes');
let utils = require('./utils');
let Koa = require('koa');
let Connectors = require('./connectors');
let Models = require('./models');

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

/**
 * Initialize a new `Application`.
 *
 * @api public
 */

function Application() {
  // return new application instance if called as function
  if (!(this instanceof Application)) return new Application;

  // inheriting from koa
  Koa.call(this);

  // Application root folder.
  this.root = process.cwd()
  // HTTP server instance.
  this.server = null;
  // attaching settings data
  this.settings = settings;
  // attaching content renderers data
  this.renderers = renderers;
  // attaching assets utilities
  this.assets = utils.assets;

  // enabling public directory direct access middleware
  this.use(require('koa-static')('public'));
  // enabling assets pipeline path middleware
  this.use(require('koa-static')('.cache/public'));
  // loading middleware for parsing `request.body`
  this.use(require('koa-bodyparser')());
  // attaching params middleware with `strong parameters` support
  this.use(params());
  // attaching renderer middleware for rendering views
  this.use(renderer());

  // attaching connectors
  this.connectors = new Connectors();
  // connection to databases
  this.connectors.connect(function() {

    // attaching models
    this.models = new Models(this.connectors);
    // attaching accessibility middleware for accessing variables
    this.use(accessibility(this));

    // activating routes
    routes().forEach(function(route) {
      this.use(route)
    }.bind(this));

    // starting application
    this.start();

  }.bind(this));
}

/**
 * Application inheritance.
 */

util.inherits(Application, Koa);

/**
 * Starts the application server.
 *
 * @param {CallbackFunction} next
 * @return {Server}
 * @api public
 */

Application.prototype.start = function(next) {
  // starting HTTP server
  this.server = this.listen(process.env.YOOM_HTTP_PORT, process.env.YOOM_HTTP_ADDRESS, function() {
    // writting a cache file with current time this other processes can track
    // application boot state
    require('filendir').ws(this.root+'/.cache/application.boot', require('microtime').now());
    // running callback if any
    if (next) next();
  });
  // returning server
  return this.server;
};

/**
 * Stops the server.
 *
 * @api public
 */

Application.prototype.stop = function() {
  // stopping the server
  if (this.server) this.server.close()
  // initializing server instance variable
  this.server = null
};

/**
 * Expose `Application`.
 */

module.exports = Application;
