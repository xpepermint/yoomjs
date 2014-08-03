#
# MODELS
#
# This module integrates **models** into the application. All models must be
# defined inside `app/models` file. Modules are provider-specific thus check
# the files under `framework/lib/models` for details. The general structure of
# the model is shown bellow.
#
#   module.exports =
#     modelName:            # optional, default: {filename}.classified.singularized
#     tableName:            # optional, default: {filename}.underscored.pluralized
#     connectorName:        # required (defined inside `config/connectors`)
#     attributes:           # required (mongoose schema definition (fields, validations))
#       name: String
#     callbacks:            # optional
#       beforeValidate:     # optional
#       beforeCreate:       # optional
#       beforeUpdate:       # optional
#       baforeSave:         # optional
#       beforeDestroy:      # optional
#       afterValidate:      # optional
#       afterCreate:        # optional
#       afterUpdate:        # optional
#       afterSave:          # optional
#       afterDestroy:       # optional
#     methods:              # optional (instance methods)
#       foo: ->
#
# All registered models are stored in `models` variable. We can access the
# variable as shown bellow.
#
#   require('../../framework/lib/models').models[{modelName}]
#

_ = require('underscore')
_path = require('path')
_fs = require('fs')

# Path to controllers directory.
rootPath = _path.join(__dirname, '..', '..', '..', 'app', 'models')

# Variable where list of loaded models will be stored
models = {}

# Loads models and discriminators.
load = ->
  # looping through modulules
  _fs.readdirSync(_path.join(__dirname, 'models')).forEach (filename) ->
    # loading models for each connector type
    loadedModels = require(_path.join(__dirname, 'models', filename)).load()
    # storing loaded models to `models` variable
    _.extend models, loadedModels


# ------------------------------------------------------------------------------

module.exports.load = load
module.exports.models = models
