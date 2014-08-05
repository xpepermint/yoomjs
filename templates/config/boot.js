'use strict';

// application instance
let app = require('yoom');

// Response time header middleware.
app.use(require('koa-response-time')());

// Static content.
app.use(require('koa-static')('public'));

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
