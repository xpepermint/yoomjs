'use strict';

//
// REQUEST
//
// This module extends KoaJS's default `request` variable.
//

let _ = require('underscore');
let app = require('../index');

// Loading middlewares for parsing `request.body` (text by default).
app.use(require('koa-bodyparser')());

// Extending the `request` with method for picking body variables (like
// strong parameters in rails).
app.use(function*(next) {
  let request = this.request;
  // You would use this it as `this.request.getBody("name", "age")`
  this.request.getBody = function() {
    return arguments.lenght==0 ? request.body : _.pick(request.body, _.flatten(_.values(arguments)));
  };
  yield next;
});
