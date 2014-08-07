'use strict';

//
// BOOT
//
// This module defines **application boot** mechanics.
//

// Express application instance.
let app = module.exports = require('koa')();

// Application server instance.
app.server = null;

// Initializes the application and starts the server.
module.exports.start = function(next) {
  // starting HTTP server
  app.server = app.listen(app.settings.httpPort, app.settings.httpAddress, function() {
    // writting a cache file with current time this other processes can track
    // application boot state
    require('filendir').ws(process.cwd()+'/.cache/boot.state', require('microtime').now());
    // running callback if any
    if (next) next();
  });
  // returning app
  return app.server;
};

// Stops the server.
module.exports.stop = function() {
  //
  app.server.close()
  // initializing server instance variable
  app.server = null
};
