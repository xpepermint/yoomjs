#
# SETTINGS
#
# This file contains application configuration data. All configurable variables
# lieves inside this file and should not be defined elswhere.
#
# Environemtn independable values are defined in the `settings.default` scope
# while the `settings.{env}` scope holds values specific to the environment
# {env}. Note that environment dependent keys override keys defined in the
# default scope.
#
# Example:
#
#   s = require('./config/settings')
#   s('db.hostname')
#

_path = require('path')
_extend = require('util')._extend

settings = require _path.join(process.cwd(), 'config', 'settings')

module.exports = (key, env) ->
  _extend(settings['defaults'], settings[env || process.env.NODE_ENV || "development"])[key]
