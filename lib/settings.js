//
// SETTINGS
//
// This file handles application configuration data. All configurable variables
// should lieve inside `{project}/config/settings` file.
//
// Environemtn independable values are defined in the `default` scope while the
// `{env}` scope holds values specific to the environment. Environment dependent
// keys override keys defined in the default scope.
//
// Example:
//
//   require('yoom').get('db.hostname');
//

var util = require('util');
var app = require('../index');

// loading project's settings
var settings = require(process.cwd()+"/config/settings");

// preparing environment data
var data = util._extend(settings['defaults'], settings[app.get('env')]);
module.exports = data;

// adding variables into express application
Object.keys(data).forEach(function(key) {
  app.set(key, data[key]);
});
