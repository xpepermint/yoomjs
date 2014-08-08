'use strict';

//
// REQUESTS
//
// This module handles **request-related functions**.
//

let _ = require('underscore');
let app = require('../index');

// Loading middlewares for parsing `request.body` (text by default).
app.use(require('koa-bodyparser')());

// Extending the `request` with method for picking body variables (like
// strong parameters in rails).
app.use(function*(next) {

  // You would use this it as `this.request.getBody("name", "age")`
  this.request.getBody = function() {
    return arguments.lenght==0 ? this.request.body : _.pick(this.request.body, _.flatten(_.values(arguments)));
  };

  // run next middleware
  yield next;
});
