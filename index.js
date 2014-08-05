'use strict';

//
// APPLICATION
//
// This module represents the main application module. Here we define and merge
// all the pieces (e.g. models, routes) together into a module that knows how to
// `start` and `stop` itself.
//
// Every project has the `config/boot.js` file which defines how the application
// should be configured and started. Because the load process is defined inside
// a project, a user can modify and extend the application easily. See the
// template file `templates/config/boot.js` to see the default boot proecss.
//

// Express application instance.
let app = module.exports = require('koa')();
// Application server instance.
app.server = null;

// Initializes the application and starts the server.
module.exports.start = function(next) {
  // starting HTTP server
  app.server = app.listen(app.settings.httpPort, app.settings.httpAddress, next);
  console.log("[application] Start in "+app.env+" mode on http://"+app.settings.httpAddress+":"+app.settings.httpPort);
  // returning app
  return app;
};

// Stops the server.
module.exports.stop = function() {
  app.server.close()
  // initializing server instance variable
  app.server = null
  // returning app
  return app;
};
