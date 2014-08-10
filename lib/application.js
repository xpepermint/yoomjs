'use strict';

/**
 * Initializing environment variables.
 */

require('./env');

/**
 * Module dependencies.
 */

let util = require("util");
let statics = require('koa-static');
let bparser = require('koa-bodyparser');
let session = require('koa-session');
let responseTime = require('koa-response-time');
let Koa = require('koa');

let settings = require('./settings');
let renderers = require('./renderers');
let renderer = require('./middlewares/renderer');
let params = require('./middlewares/params');
let context = require('./middlewares/context');
let routes = require('./middlewares/routes');
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
  this.settings = settings;

  // attaching content renderers data TODO?
  this.renderers = renderers;

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
  // when connected to database
  this.on('connect', function(stream) {
    // attaching models
    this.models = new Models(this.connectors);
    // attaching context middleware for accessing variables
    this.use(context());

    // activating routes
    routes().forEach(function(route) {
      this.use(route);
    }.bind(this));

  }.bind(this));
}

/**
 * Application inheritance.
 */

util.inherits(Application, Koa);

/**
 * Starts the application server.
 *
 * @param {Function} next
 * @return {Application}
 * @api public
 */

Application.prototype.start = function(next) {
  // connecting
  this.connectors.connect(function() {
    // triggering event
    this.emit('connect');
    // starting HTTP server
    this.server = this.listen(process.env.YOOM_HTTP_PORT, process.env.YOOM_HTTP_ADDRESS, function() {
      // writting a cache file with current time this other processes can track
      // application boot state
      require('filendir').ws(this.root+'/.cache/application.boot', require('microtime').now());
      // triggering event
      this.emit('start');
      // running callback if any
      if (next) next();
    });
  }.bind(this));
  // return application
  return this;
};

/**
 * Stops the server.
 *
 * @return {Application}
 * @api public
 */

Application.prototype.stop = function() {
  // stopping the server
  if (this.server) this.server.close()
  // triggering event
  this.emit('disconnect');
  // initializing server instance variable
  this.server = null
  // triggering event
  this.emit('stop');
  // return application
  return this;
};


/**
 * Expose `Application`.
 */

module.exports = Application;
