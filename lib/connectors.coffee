#
# PROVIDERS (DATABASE CONNECTORS)
#
# This module integrates **connectors** into the application. A connector
# provides a connection to a database. The connectors are used by models. You
# can have as many connectors per project as you like (multiple databases). The
# connectors must be defined inside `config/connectors` as shown bellow.
#
#   module.exports =
#     {customConnectorName}:
#       connector: {connectorType}
#       {connectorSpecificData}
#
# All open database connections are stored in the `connections` variable. We can
# access this variable as shown bellow.
#
#   db = require('../../framework/lib/connectors').connections[{connectorName}]
#   db.model({modelName})
#

_path = require('path')

# Defined connectors.
connectors = require _path.join(process.cwd(), 'config', 'connectors')

# Database connections.
connections = {}

# Connects all connectors required by the project's configuration data.
connect = (cb) ->
  # list of defined connectors
  connectorNames = Object.keys(connectors)
  # recursive function that loads each connector
  loadNext = (nextIndex) ->
    connectorName = connectorNames[nextIndex]
    connectorData = connectors[connectorName]
    if connectorData
      require(_path.join(__dirname, 'connectors', connectorData.connector)).load connectorData, (conn) ->
        connections[connectorName] = conn
        loadNext(nextIndex+1)
    else
      cb()
  # start loading connectors
  loadNext(0)

# Destroys all active connections.
disconnect = (cb) ->
  # list of defined connectors
  connectorNames = Object.keys(connections)
  # recursive function that disconnects each connector
  disconnectNext = (nextIndex) ->
    connectorName = connectorNames[nextIndex]
    if connectorName
      connections[connectorName].close()
      delete connections[connectorName]
      disconnectNext(nextIndex+1)
    else
      cb()
  # start loading connectors
  disconnectNext(0)


# ------------------------------------------------------------------------------

module.exports.connect = connect
module.exports.disconnect = disconnect
module.exports.connections = connections
