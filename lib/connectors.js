'use strict';

//
// CONNECTORS (DATABASE CONNECTORS)
//
// This module integrates **connectors** into the application. A connector
// provides a connection to a database. The connectors are used by models. You
// can have as many connectors per project as you like (multiple databases). The
// connectors must be defined inside `config/connectors` as shown bellow.
//
//   module.exports =
//     {customConnectorName}:
//       connector: {connectorType}
//       {connectorSpecificData}
//
// All open database connections are stored in the `connections` variable. We can
// access this variable as shown bellow.
//
//   require('yoom/lib/connectors').get({connectorName})
//

// Defined connectors.
const connectorsData = require(process.cwd()+"/config/connectors");

// Database connections.
let connections = {};

// Connects all connectors required by the project's configuration data.
module.exports.connect = function(next) {
  // list of defined connectors
  let connectorNames = Object.keys(connectorsData);
  // recursive function that loads each connector
  let loadNext = function(nextIndex) {
    let connectorName = connectorNames[nextIndex];
    let connectorData = connectorsData[connectorName];
    if (connectorData) {
      require(__dirname+"/connectors/"+connectorData.connector)(connectorData, function(conn) {
        connections[connectorName] = conn;
        loadNext(nextIndex+1);
      });
    }
    else {
      next();
    }
  };
  // start loading connectors
  loadNext(0);
};

// Destroys all active connections.
module.exports.disconnect = function(next) {
  // list of defined connectors
  let connectorNames = Object.keys(connections);
  // recursive function that disconnects each connector
  let disconnectNext = function(nextIndex) {
    let connectorName = connectorNames[nextIndex];
    if (connectorName) {
      connections[connectorName].close();
      delete connections[connectorName];
      disconnectNext(nextIndex+1);
    }
    else {
      next();
    }
  };
  // start loading connectors
  disconnectNext(0);
};

// Returns an opened connection.
module.exports.get = function(name) {
  return connections[name];
};
