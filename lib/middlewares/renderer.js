'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
let path = require('path');

/**
 * Content view rendering middleware.
 *
 * @return {GeneratorFunction}
 * @api private
 */

module.exports = function() {

  /**
   * Class dependencies.
   */

  let renderers = require('../renderers');
  let root = process.cwd();

  /**
   * Middleware
   */

  return function*(next) {

    // adding application signature header
    this.set('X-Powered-By', 'YOOM.js');

    /*
     * Returns a generator function that compiles a view source view. The
     * function uses `compilers` and `minifiers` to render the output. The
     * method automatically sets the `this.body` and `this.type` context data.
     *
     *    this.render('index.jade', { name: "Bob" });
     *
     * @return {GeneratorFunction}
     * @api public
     */

    this.render = function(view, data) {
      return function*() {
        // adding data to context (it's ok to do that because the render is the
        // last call in a session)
        this.data = data;
        // view path definition
        let source = root+'/app/views/'+view;
        // view extension
        let ext = path.extname(source)
        // setting response content type
        this.type = 'text/html';
        // rendering the content (make sure that compilers do not cache views)
        // TODO Cache views in memory/redis
        this.body = yield renderers.compilers[ext](source, this);
        // minifying content
        this.body = yield renderers.minifiers['.html'](this.body);
      };
    };

    // run next middleware
    yield next;
  }
};
