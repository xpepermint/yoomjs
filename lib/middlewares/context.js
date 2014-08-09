'use strict';

/**
 * Context middleware (accessing variables).
 *
 * @params {Application} app
 * @return {GeneratorFunction}
 * @api private
 */

module.exports = function() {
  return function*(next) {

    // creating models getters
    Object.keys(this.app.models.all).forEach(function(name) {
      this.__defineGetter__(name, function() {
        return this.app.models.object(name);
      })
    }.bind(this));

    // run next middleware
    yield next;
  }
};
