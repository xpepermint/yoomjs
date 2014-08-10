'use strict';

/**
 * Application configuration loading.
 */

require('./boot');

/**
 * Module dependencies.
 */

let util = require("util");
let statics = require('koa-static');
let bparser = require('koa-bodyparser');
let session = require('koa-session');
let Koa = require('koa');
let responseTime = require('koa-response-time');

let renderer = require('./middlewares/renderer');
let params = require('./middlewares/params');
let context = require('./middlewares/context');
let routes = require('./middlewares/routes');
let utils = require('./utils');
let Connectors = require('./connectors');
let Models = require('./models');

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

  // response time header
  if (this.env == 'development') this.use(responseTime());

  // Application root folder.
  this.root = process.cwd()
  // HTTP server instance.
  this.server = null;
  // attaching settings data
  this.settings = require('./settings');
  // attaching content renderers data
  this.renderers = require('./renderers');
  // attaching assets utilities
  this.assets = utils.assets;

  // application secret key
  this.keys = [process.env.YOOM_SECRET];
  // enabling session middlewar
  this.use(session({ key: "yoomjs:sess" }));
  // enabling public directory direct access middleware
  this.use(statics('public'));
  // enabling assets pipeline path middleware
  this.use(statics('.cache/public'));
  // loading middleware for parsing `request.body`
  this.use(bparser());
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
    // attaching context middleware for accessing variables
    this.use(context());

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
