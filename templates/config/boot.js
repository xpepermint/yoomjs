'use strict';

// application instance
module.exports = require('yoom');

// Global settings.
require('yoom/lib/settings');

// Assets pipeline.
require('yoom/lib/assets');

// Request extensions.
require('yoom/lib/requests');

// Database connectors.
require('yoom/lib/connectors').connect(function() {

  // Models implementation.
  require('yoom/lib/models');

  // Controllers implementation.
  require('yoom/lib/controllers');

  // Application start.
  module.exports.start();
});
