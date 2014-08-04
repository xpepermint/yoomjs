#
# MONGOOSE MODELS
#
# This module integrates **mongoose models** into the application. Beside the
# general structure in mongoose models you can defined some additional variables
# as shown bellow.
#
#   module.exports =
#     discriminator:        # optional, default: null
#
# NOTE: Callbacks are not triggered on operations executed directly on the
# database. You should `find()` the document first and then update/destroy it.

_fs = require('fs')
_path = require('path')
_util = require('util')
_ = require('underscore')
_s = require('underscore.string')
_natur = new (require('natural').NounInflector)()
_time = require('time')
_mongo = require('mongoose')
_conn = require('../connectors')







# Logger setup.
_log = require('winston')
_mongo.set 'debug', (coll, method, query, doc, options) ->
  _log.error('%s.%s(%s) doc=%s options=%s', coll, method, JSON.stringify(Object(query)), JSON.stringify(Object(doc)), JSON.stringify(Object(options)))







# Path to controllers directory.
projectModelsPath = _path.join(process.cwd(), 'app', 'models')

# All registered models.
models = {}

# Loads model at path (based on http://mongoosejs.com/docs/guide.html).
loadModel = (filePath) ->
  modelData = require filePath
  # preparing model schema class
  schemaInstance = createModelSchema(modelData)
  # preparing model name and table name
  modelName = modelData.modelName || filePathToModelName(filePath)
  tableName = modelData.tableName || modelNameToTableName(modelName)
  # registering mongoose model
  dbConnection = _conn.get(modelData.connectorName)
  models[modelName] = dbConnection.model(modelName, schemaInstance, tableName)

# Loads model at path (based on http://mongoosejs.com/docs/api.html#model_Model-discriminators).
loadDiscriminator = (filePath) ->
  discriminatorData = require filePath
  modelData = require _path.join(projectModelsPath, modelNameToFileName(discriminatorData.discriminator))
  schemaData = _.extend(_.clone(modelData), discriminatorData)
  # preparing model schema class
  schemaInstance = createModelSchema(schemaData)
  # preparing model name
  discriminatorModelName = discriminatorData.modelName || filePathToModelName(filePath)
  # registering mongoose model
  dbConnection = _conn.get(modelData.connectorName)
  models[discriminatorModelName] = dbConnection.model(discriminatorData.discriminator).discriminator(discriminatorModelName, schemaInstance)

# Creates model schema instance based on model data. Here we implement model
# behaviour (e.g. timestamp attributes, callbacks).
createModelSchema = (modelData) ->
  # new mongoose schema instance
  schemaInstance = new _mongo.Schema
  # model attributes
  schemaInstance.add(modelData.attributes)
  # instance methods
  schemaInstance.method(modelData.methods) if modelData.methods
  # enabling timestamp auto attributes
  attachModelSchemaTimestampLogic(schemaInstance)
  # attaching callbacks (must be called after timestamp logic)
  attachModelSchemaCallbacks(schemaInstance, modelData) if modelData.callbacks
  # returning model schema instance
  schemaInstance

# Adds the createdAt and updatedAt attributes to the schema instance. These
# attributes are automatically set and updated.
attachModelSchemaTimestampLogic = (schemaInstance) ->
  schemaInstance.add({ createdAt: Date, updatedAt: Date })
  schemaInstance.pre 'save', (next) ->
    date = currentDate('UTC')
    this.createdAt = date if (!this.createdAt)
    this.updatedAt = date
    next()

# Adds callback functions defined in the model to schema instance. Note that
# based on this http://github.com/LearnBoost/mongoose/issues/964 callbacks are
# not performed on operations executed directly on the database. You should
# `find()` the document first and then update/destroy it.
attachModelSchemaCallbacks = (schemaInstance, modelData) ->
  # loop through defined callbacks
  Object.keys(modelData.callbacks).forEach (callbackName) ->
    # attaching callbacks
    if callbackName == 'beforeValidate'
      schemaInstance.pre 'validate', (next) ->
        modelData.callbacks.beforeValidate(this)
        next()
    else if callbackName == 'afterValidate'
      schemaInstance.post 'validate', (model) ->
        modelData.callbacks.afterValidate(this)
    else if callbackName == 'beforeCreate'
      schemaInstance.pre 'save', (next) ->
        modelData.callbacks.beforeCreate(this) if this.createdAt.toString()==this.updatedAt.toString()
        next()
    else if callbackName == 'afterCreate'
      schemaInstance.post 'save', (model) ->
        modelData.callbacks.afterCreate(this) if this.createdAt.toString()==this.updatedAt.toString()
    else if callbackName == 'beforeUpdate'
      schemaInstance.pre 'save', (next) ->
        modelData.callbacks.beforeUpdate(this) if this.createdAt.toString()!=this.updatedAt.toString()
        next()
    else if callbackName == 'afterUpdate'
      schemaInstance.post 'save', (model) ->
        modelData.callbacks.afterUpdate(this) if this.createdAt.toString()!=this.updatedAt.toString()
    else if callbackName == 'beforeSave'
      schemaInstance.pre 'save', (next) ->
        modelData.callbacks.beforeSave(this)
        next()
    else if callbackName == 'afterSave'
      schemaInstance.post 'save', (model) ->
        modelData.callbacks.afterSave(this)
    else if callbackName == 'beforeDestroy'
      schemaInstance.pre 'remove', (next) ->
        modelData.callbacks.beforeDestroy(this)
        next()
    else if callbackName == 'afterDestroy'
      schemaInstance.post 'remove', (model) ->
        modelData.callbacks.afterDestroy(this)

# Returns the model name from file path.
filePathToModelName = (filePath) ->
  baseName = _path.basename(filePath, '.coffee')
  _natur.singularize(_s.classify(baseName))

# Returns the table name from model name.
modelNameToTableName = (modelName) ->
  _natur.pluralize(_s.underscored(_s.camelize(modelName)))

# Returns the file name from model name.
modelNameToFileName = (modelName) ->
  _natur.singularize(_s.underscored(_s.camelize(modelName)))

# Returns current date.
currentDate = (region) ->
  d = new _time.Date()
  d.setTimezone(region)
  d

# Loops through all the files defined in `app/models` directory and load only
# modules where `discriminators==null`.
_fs.readdirSync(projectModelsPath).forEach (filename) ->
  filePath = _path.join(projectModelsPath, filename)
  # ignoring directories
  if _fs.statSync(filePath).isFile()
    # loading model data
    modelData = require(filePath)
    # loading model if not discriminator
    if !modelData.connector || modelData.connector == 'mongoose'
      unless modelData.discriminator?
        loadModel(filePath)

# Loops through all the files defined in `app/models` directory and load only
# modules where `discriminators!=null`. Note that discriminatored modules
# inherits from the parent model defined by `discriminators` variable.
_fs.readdirSync(projectModelsPath).forEach (filename) ->
  filePath = _path.join(projectModelsPath, filename)
  # ignoring directories
  if _fs.statSync(filePath).isFile()
    # loading model schema
    modelData = require(filePath)
    # loading model if not discriminator
    if !modelData.connector || modelData.connector == 'mongoose'
      if modelData.discriminator?
        loadDiscriminator(filePath)

# All loaded models are exposed.
module.exports = models
