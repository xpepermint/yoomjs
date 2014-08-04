#
# MODELS
#
# This module integrates **models** into the application. All models must be
# defined inside `app/models` directory. Modules are connector-specific. The
# general structure of the model is shown bellow.
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
# model module as shown bellow.
#
#   require('yoom/lib/models').get({modelName})
#

util = require('util')
fs = require('fs')

# Variable where list of loaded models will be stored
models = {}

# looping through modulules
fs.readdirSync("#{__dirname}/models").forEach (filename) ->
  # loading models for each connector type
  loadedModels = require("#{__dirname}/models/#{filename}")
  # storing loaded models to `models` variable
  util._extend models, loadedModels

# Returns a model.
module.exports.get = (name) ->
  models[name]
