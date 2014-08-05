'use strict';

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
// You can accees the settings hash as shown bellow.
//
//   require('yoom').settings.{variableName};
//
// In a controller the `settings` variable is attached to the context thus we
// can access it as `this.settings` (e.g. just as you would access the request).
//

let util = require('util');
let app = require('../index');

// loading project's settings
const settings = require(process.cwd()+"/config/settings");

// preparing environment data
let data = module.exports = util._extend(settings['defaults'], settings[app.env]);

// attaching settings to application instance
app.settings = data;
app.use(function*(next) {
  this.settings = data;
  yield next;
});
