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
_root = _path.join(_path.dirname(require.main.filename), '..') # project's root

# Defined connectors.
connectors = require _path.join(_root, 'config', 'connectors')

# Database connections.
connections = {}

# Loads all required connectors based on project's configuration data.
load = (cb) ->
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


# ------------------------------------------------------------------------------

module.exports.load = load
module.exports.connections = connections
