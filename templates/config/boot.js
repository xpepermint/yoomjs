'use strict';

// application instance
let app = require('yoom');

// Response time header middleware (https://github.com/koajs/response-time).
//app.use(require('koa-response-time')());

// Request extensions.
require('yoom/lib/requests');

// Settings implementation.
require('yoom/lib/settings');

// Database connectors.
require('yoom/lib/connectors').connect(function() {

  // Models implementation.
  require('yoom/lib/models');

  // Controllers implementation.
  require('yoom/lib/controllers');

  // Application start.
  app.start();
});
