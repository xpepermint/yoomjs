'use strict';

//
// VIEWS
//
// This module integrates **views** into the application. All views must be
// defined inside `app/views` directory. Multiple renderers are supported.
//

let app = require('..');
let _ = require('underscore');
let path = require('path');
let renderers = require('./renderers');

// Project paths.
let projectRoot = process.cwd();
let viewsRoot = projectRoot+'/app/views';

// View middleware.
app.use(function*(next) {

  // initializing locals
  this.locals = this.locals || {};

  // Returns generator function that returns compiled html source. The function
  // uses `compilers` and `minifiers` to render the output.
  //
  //    this.body = yield this.render('index.jade', { name: "Bob" });
  //
  this.render = function(view, data) {
    return function*() {
      // merging provided variables with global locals data
      var locals = _.extend(_.clone(this.locals), data);
      // view path definition
      let source = viewsRoot+'/'+view;
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
});
