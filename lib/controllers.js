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

let app = require('..');
let _ = require('underscore');
let router = require('koa-route');

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

// Loading middleware for parsing `request.body` (needed for ready data posted
// to a server as e.g. POST method).
app.use(require('koa-bodyparser')());

// Extending the `request` with method for picking body variables (like
// strong parameters in rails).
app.use(function*(next) {

  // Return a hash where URL params and body vars are merged. If the method
  // receives no attributes then all parameters are returned. The function will
  // return only requested parameters if we pass a list of parameter names.
  //
  //    this.params()               ... All parameters are returned.
  //    this.params('p1', 'p2')     ... Only parameters `p1` and `p2` are returned.
  //
  this.params = function() {
    // merging multiple types of parameters
    let all = _.extend(_.clone(this.query), this.request.body);
    // returning allowed parameters
    return arguments.lenght==0 ? all : _.pick(all, _.flatten(_.values(arguments)));
  }

  // run next middleware
  yield next;
});

// Loading routes middlewares from `config/routes`. This will enable accessing
// controller actions based on URL path.
let routesData = require(process.cwd()+"/config/routes");
Object.keys(routesData).forEach(function(key) {
  app.use(createRoute(key, routesData[key]));
});
