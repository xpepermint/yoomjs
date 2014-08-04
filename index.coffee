#
# APPLICATION
#
# This module represents the main application module. Here we define and merge
# all the pieces (e.g. models, routes) together into a module that knows how to
# `start` and `stop` itself.

# Express application instance.
module.exports = app = require('express')()
# Application server instance.
app.server = null

# Initializes the application and starts the server.
module.exports.start = (next) ->
  # loading settings
  require('./lib/settings')
  # connection mong database
  require('./lib/connectors').connect ->
    # loading models
    require('./lib/models')
    # loading controllers
    require('./lib/controllers')
    # starting HTTP server
    app.server = app.listen app.get('http.port'), app.get('http.address'), next
    console.log("[application] Start in #{app.get('env')} mode on http://#{app.get('http.address')}:#{app.get('http.port')}")
  # returning app
  app

# Stops the server.
module.exports.stop = ->
  # stopping HTTP server
  require('./lib/connectors').disconnect ->
    app.server.close()
    # initializing server instance variable
    app.server = null
  # returning app
  app
