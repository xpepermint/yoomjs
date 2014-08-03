#
# APPLICATION
#
# This module represents the main application module. Here we define and merge
# all pieces (e.g. models, routes) together into a module that knows how to
# `lift` and `lower` the application.
#
# Example:
#
#   app = require('./config/application')
#   app.lift ->
#     app.lower()
#


_path = require('path')
_express = require('express')
_cfg = require _path.join(__dirname, 'lib', 'settings')
_connectors = require _path.join(__dirname, 'lib', 'connectors')
_models = require _path.join(__dirname, 'lib', 'models')
_controllers = require _path.join(__dirname, 'lib', 'controllers')

# Express application instance.
app = _express()

# Application server instance.
http = null

# Return a setting.
app.setting = (key) ->
  _cfg(key)

# Return a model module.
app.model = (name) ->
  _models.models[name]


# Initializes the application and starts the server.
lift = (next) ->
  # connection mong database
  _connectors.load ->
    # loading models
    _models.load(app)
    # loading controllers
    _controllers.load(app)
    # starting HTTP server
    http = app.listen(_cfg('http.port'), _cfg('http.address'), next)
    console.log("[Application] Start in #{app.get('env')} mode on http://#{_cfg('http.address')}:#{_cfg('http.port')}")
  # returning app
  app

# Stops the server.
lower = ->
  console.log("Stopping ...")
  # stopping HTTP server
  http.close()
  # initializing server instance variable
  http = null
  # returning app
  app


# ------------------------------------------------------------------------------

module.exports = app
module.exports.http = http
module.exports.lift = lift
module.exports.lower = lower
