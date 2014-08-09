'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
let path = require('path');
let renderers = require('../renderers');
let root = process.cwd();

/**
 * Content view rendering middleware.
 *
 * @return {GeneratorFunction}
 * @api private
 */

module.exports = function() {
  return function*(next) {

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
        // merging provided variables with global locals data
        var locals = _.merge(_.cloneDeep(Object(this.locals)), data);
        // view path definition
        let source = root+'/app/views/'+view;
        // view extension
        let ext = path.extname(source)
        // setting response content type
        this.type = 'text/html';
        // rendering the content
        this.body = yield renderers.compilers[ext](source, locals);
        // minifying content
        this.body = yield renderers.minifiers['.html'](this.body);
      };
    };

    // run next middleware
    yield next;
  }
};
