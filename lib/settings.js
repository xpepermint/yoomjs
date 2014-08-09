'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
const data = require(process.cwd()+"/config/settings");

/**
 * This module holds application **settings**. All configurable variables
 * should be defined inside `config/settings` file.
 *
 * Environemtn independable values are defined in the `default` scope.
 * Environment dependent keys override keys defined in the default scope.
 *
 * The `settings` variable is attached to the context and is available (we can
 * access them just as you would access the `this.request`).
 *
 * @api public
 */

exports = _.merge(data['defaults'], data[process.env.YOOM_ENV]);
