'use strict';

//
// APPLICATION
//
// This module represents the main application module. Here we define and merge
// all the pieces (e.g. models, routes) together into a module that knows how to
// `start` and `stop` itself.
//

// Express application instance.
let app = module.exports = require('koa')();
// Application server instance.
app.server = null;

// Initializes the application and starts the server.
module.exports.start = function(next) {
  // loading settings
  require('./lib/settings');
  // connection mong database
  require('./lib/connectors').connect(function() {
    // loading models
    require('./lib/models');
    // loading request extensions
    require('./lib/requests');
    // loading controllers
    require('./lib/controllers');
    // starting HTTP server
    app.server = app.listen(app.settings.httpPort, app.settings.httpAddress, next);
    console.log("[application] Start in "+app.env+" mode on http://"+app.settings.httpAddress+":"+app.settings.httpPort);
  });
  // returning app
  return app;
};

// Stops the server.
module.exports.stop = function() {
  // stopping HTTP server
  require('./lib/connectors').disconnect(function() {
    app.server.close()
    // initializing server instance variable
    app.server = null
  });
  // returning app
  return app;
};
