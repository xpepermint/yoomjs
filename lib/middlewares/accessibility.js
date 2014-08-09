'use strict';

/**
 * Accessibility middleware (accessing variables in context and inside views).
 *
 * @params {Application} app
 * @return {GeneratorFunction}
 * @api private
 */

module.exports = function(app) {
  return function*(next) {

    // initializing locals with recpect
    this.locals = this.locals || {};

    // connecting parameters
    this.locals.params = this.params;
    // connecting settings
    this.locals.settings = this.settings = app.settings;
    // connecting assets
    this.locals.assets = this.assets = app.assets;

    // accessing models
    this.model = this.locals.model = function(name) {
      console.log(app.models)
      return app.models.object(name);
    };

    // run next middleware
    yield next;
  }
};
