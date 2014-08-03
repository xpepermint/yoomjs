#
# CONTROLLERS (& ROUTES)
#
# This module integrates **routes** and **controllers** into the application.
# All routes must be defined inside `config/routes.coffee` file as shown bellow.
#
#   module.exports =
#     '/': '/api/v1/triggers'
#     '/api/v1/users/:id?': 'users#index'
#     'delete /api/v1/users/:id': 'users#destroy'
#
# Controllers must be defined inside `app/controllers` directory as shown bellow.
#
#   module.exports =
#     index: (req, res) ->
#       res.json(data)
#     destroy: (req, res) ->
#       res.send(data)
#

_path = require('path')
_bpars = require('body-parser')
_router = require('express').Router()
_routes = require _path.join('..', '..', '..', 'config', 'routes')

# Path to controllers directory.
rootPath = _path.join(__dirname, '..', '..', '..', 'app', 'controllers')

# Loads middlewares for parsing request data These middlewares populates the
# `req.body` variable which is available to every controller (route callback).
loadBodyParsers = (app) ->
  app.use(_bpars.json())
  app.use(_bpars.urlencoded({ extended: true }))

# Reads the `config/routes` file and configures the middleware router.
loadRoutes = (app) ->
  # looping through routes definitions
  Object.keys(_routes).forEach (key) ->
    # defining the route
    loadRoute(key, _routes[key], rootPath)
  # attaching router middleware to express application instance
  app.use(_router)

# Creates a new router's route definition. The `key` attribute is the request
# design, the `value` attribute is the target action that should be triggered
# when the request design maches. See how the route should be defined bellow.
#
#   {key}: {value}
#
loadRoute = (key, value) ->
  keyData = parseRouteKey(key)
  valueData = parseRouteValue(value)
  # redirecting routes
  if valueData.redirectTo
    callback = (req, res) ->
      res.redirect valueData.redirectTo
  else
    callback = require(_path.join(rootPath, valueData.controller))[valueData.action]
  _router[keyData.method](keyData.path, callback)

# Parses the `key` attribute which defines the request design. See the list of
# known request designs bellow.
#
#   '{urlPath}'
#   '{method} {urlPath}'
#
parseRouteKey = (key) ->
  parts = key.split(' ')
  method = 'get'
  path = parts[0]
  if parts[1]?
    method = parts[0]
    path = parts[1]
  { method: method.toLowerCase(), path: path }

# Parses the `value` attribute which defines the action that should be triggered
# when the request design maches.. See the list of known actions bellow.
#
#   '{http|https|ftp}://{path}'
#   '/{path}'
#   '{controller}'
#   '{controller}#{action}'
#
parseRouteValue = (value) ->
  # redirections
  if ['http:', 'https:', 'ftp:'].indexOf(value.split('/')[0]) == 0 || value[0] == '/'
    return { redirectTo: value }
  # controllers and actions
  parts = value.split('#')
  { controller: parts[0], action: parts[1]||'index' }


# Integrates routes and controllers.
load = (app) ->
  loadBodyParsers(app)
  loadRoutes(app)


# ------------------------------------------------------------------------------

module.exports.load = load
