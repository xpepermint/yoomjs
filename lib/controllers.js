'use strict';

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

let router = require('koa-route');
let app = require('../index');

// Path to controllers directory.
const projectControllersPath = process.cwd()+"/app/controllers";

// Creates a new router's route definition. The `key` attribute is the request
// design, the `value` attribute is the target action that should be triggered
// when the request design maches. See how the route should be defined bellow.
//
//   {key}: {value}
//
let createRoute = function(key, value) {
  let keyData = parseRouteKey(key);
  let valueData = parseRouteValue(value);
  let callback;
  // redirecting routes
  if (valueData.redirectTo) {
    callback = function*(req, res) {
      this.redirect(valueData.redirectTo);
    };
  }
  // controllers/action
  else if (valueData.controller) {
    callback = require(projectControllersPath+"/"+valueData.controller)[valueData.action];
  }
  // text
  else {
    callback = function*() {
      this.body = valueData.data;
    };
  }
  return router[keyData.method](keyData.path, callback);
}

// Parses the `key` attribute which defines the request design. See the list of
// known request designs bellow.
//
//   '{urlPath}'
//   '{method} {urlPath}'
//
let parseRouteKey = function(key) {
  let parts = key.split(' ');
  let method = 'get';
  let path = parts[0];
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
let parseRouteValue = function(value) {
  // redirections
  if (['http:', 'https:', 'ftp:'].indexOf(value.split('/')[0]) == 0 || value[0] == '/') {
    return { redirectTo: value }
  }
  // controllers/actions
  else if (value.indexOf('#') != -1) {
    let parts = value.split('#');
    return { controller: parts[0], action: parts[1]||'index' };
  }
  // text
  return { data: value };
}

// Loading routes middlewares from `config/routes`.
let routesData = require(process.cwd()+"/config/routes");
Object.keys(routesData).forEach(function(key) {
  app.use(createRoute(key, routesData[key]));
});
