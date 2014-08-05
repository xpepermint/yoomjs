'use strict';

// application instance
let app = require('yoom');
// loading settings
require('yoom/lib/settings');
// loading request extensions
require('yoom/lib/requests');
// connection mong database
require('yoom/lib/connectors').connect(function() {
  // loading models
  require('yoom/lib/models');
  // loading controllers
  require('yoom/lib/controllers');
  // lifting application
  app.start();
});
