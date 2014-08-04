//
// CONTROLLERS & ROUTES
//
// This module integrates **routes** and **controllers** into the application.
// All routes must be defined inside `config/routes.coffee` file.
//
//    module.exports = {
//      '/': '/api/v1/triggers',
//      '/api/v1/users/:id?': 'users#index',
//      'delete /api/v1/users/:id': 'users#destroy'
//    };
//
// Controllers must be defined inside `app/controllers` directory.
//
//    module.exports = {
//      index: function(req, res) {
//        res.json(data);
//      }
//    };
//

var app = require('../index');

// Path to controllers directory.
var projectControllersPath = process.cwd()+"/app/controllers";

// Creates a new router's route definition. The `key` attribute is the request
// design, the `value` attribute is the target action that should be triggered
// when the request design maches. See how the route should be defined bellow.
//
//   {key}: {value}
//
var loadRoute = function(key, value) {
  var keyData = parseRouteKey(key);
  var valueData = parseRouteValue(value);
  // redirecting routes
  if (valueData.redirectTo) {
    callback = function(req, res) {
      res.redirect(valueData.redirectTo);
    };
  }
  // controllers/action
  else if (valueData.controller) {
    callback = require(projectControllersPath+"/"+valueData.controller)[valueData.action];
  }
  // text
  else {
    callback = function(req, res) {
      res.send(valueData.data);
    };
  }
  // loading route
  router[keyData.method](keyData.path, callback);
}

// Parses the `key` attribute which defines the request design. See the list of
// known request designs bellow.
//
//   '{urlPath}'
//   '{method} {urlPath}'
//
var parseRouteKey = function(key) {
  var parts = key.split(' ');
  var method = 'get';
  var path = parts[0];
  if (parts[1]) {
    method = parts[0];
    path = parts[1];
  }
  return {
    method: method.toLowerCase(),
    path: path
  };
}

// Parses the `value` attribute which defines the action that should be
// triggered when the request design maches.
//
//   '{http|https|ftp}://{path}'
//   '/{path}'
//   '{controller}#{action}'
//   '... some text ...'
//
var parseRouteValue = function(value) {
  // redirections
  if (['http:', 'https:', 'ftp:'].indexOf(value.split('/')[0]) == 0 || value[0] == '/') {
    return { redirectTo: value }
  }
  // controllers/actions
  else if (value.indexOf('#') != -1) {
    parts = value.split('#');
    return { controller: parts[0], action: parts[1]||'index' };
  }
  // text
  return { data: value };
}

// Loading middlewares for parsing request data These middlewares populates the
// `req.body` variable which is available to every controller (route callback).
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Loading routes middlewares from `config/routes`.
var routesData = require(process.cwd()+"/config/routes");
var router = require('express').Router();
app.use(router);
Object.keys(routesData).forEach(function(key) {
  loadRoute(key, routesData[key], projectControllersPath);
});
