//
// MONGOOSE CONNECTORS
//
// This connector creates a new connection to the MongoDB database.

var mongoose = require('mongoose');

module.exports = function(data, next) {
  var uris = Array(data.uris).join(',');
  var options = Object(data.options);
  // connecting to db
  var conn = mongoose.createConnection(uris, options, function() {
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
