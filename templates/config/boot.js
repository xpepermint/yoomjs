'use strict';

// application instance
module.exports = require('yoom');

// Global settings.
require('yoom/lib/settings');

// Assets pipeline.
require('yoom/lib/assets');

// Database connectors.
require('yoom/lib/connectors').connect(function() {

  // Views implementation.
  require('yoom/lib/views');

  // Models implementation.
  require('yoom/lib/models');

  // Controllers implementation.
  require('yoom/lib/controllers');

  // Application start.
  module.exports.start();
});
