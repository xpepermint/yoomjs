'use strict';

//
// VIEWS
//
// This module integrates **views** into the application. All views must be
// defined inside `app/views` directory. Multiple renderers are supported.
//

let _ = require('underscore');
let app = require('../index');
let path = require('path');
let fs = require('fs');

var swig  = require('swig');
var jade = require('jade');
var minify = require('html-minifier').minify

let viewsRoot = process.cwd()+'/app/views';

// Predefined view renderers.
exports.renderers = {
  '.html': function(path, locals) {
    return function(next) { next(null, swig.compileFile(path)(locals)) };
  },
  '.jade': function(path, locals) {
    return function(next) { next(null, jade.renderFile(path, locals)) };
  }
};

// Predefined view minifiers.
exports.minifiers = {
  '.html': function(html) {
    return function(fn) { fn(null, minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeCommentsFromCDATA: true,
      minifyJS: true,
      minifyCSS: true
    })) };
  }
};

// View middleware.
app.use(function*(next) {

  // initializing locals
  this.locals = this.locals || {};

  // Returns generator function that returns compiled html source. The function
  // uses `renderers` and `minifiers` to render the output.
  //
  //    this.body = yield this.render('index.jade', { name: "Bob" });
  //
  this.render = function(view, data) {
    return function *() {
      // merging provided variables with global locals data
      var locals = _.extend(_.clone(this.locals), data);
      // view path definition
      let source = viewsRoot+'/'+view;
      // view extension
      let ext = path.extname(source)
      // setting response content type
      this.type = 'text/html';
      // rendering the content
      this.body = yield exports.renderers[ext](source, locals);
      // minifying content
      this.body = yield exports.minifiers[ext](this.body);
    };
  };

  // run next middleware
  yield next;
});
