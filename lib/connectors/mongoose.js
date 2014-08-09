'use strict';

/**
 * Module dependencies.
 */

let mongoose = require('mongoose');

/**
 * This connector creates a new connection to the **MongoDB database**.
 *
 * @api public
 */

module.exports = function(data, next) {
  let uris = Array(data.uris).join(',');
  let options = Object(data.options);

  // connecting to db
  let conn = mongoose.createConnection(uris, options, function() {
    next(conn);
  });

  // registering `connected` event
  conn.on("connected", function(err) {
    console.log("[mongoose] connected uris="+uris+", options="+JSON.stringify(options));
  });

  // registering 'error' event
  conn.on("error", function(err) {
    console.log("[mongoose] "+err);
  });
};
