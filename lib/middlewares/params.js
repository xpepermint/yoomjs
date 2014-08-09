'use strict';

/**
 * Module dependencies.
 */

let _ = require('underscore');

/**
 * Parameters middleware (similar to strong parameters in Rails).
 *
 * @return {GeneratorFunction}
 * @api private
 */

module.exports = function() {
  return function*(next) {

    /*
     * Returns a hash where URL params and body vars are merged. If the method
     * receives no attributes then all parameters are returned. The function
     * will return only requested parameters if at leas one parameter is sent
     * as an argument.
     *
     *    this.params()             ... All parameters are returned.
     *    this.params('p1', 'p2')   ... Only parameters `p1` and `p2` are returned.
     */

    this.params = function() {
      // merging multiple types of parameters
      let all = _.extend(_.clone(this.query), this.request.body);
      // returning allowed parameters
      return arguments.lenght==0 ? all : _.pick(all, _.flatten(_.values(arguments)));
    }

    // run next middleware
    yield next;
  }
};
