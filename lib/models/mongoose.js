'use strict';

/**
 * Module dependencies.
 */

let _ = require('underscore');
let _s = require('underscore.string');
let fs = require('fs');
let path = require('path');
let inflactor = new (require('natural').NounInflector)();
let time = require('time');
let mongoose = require('mongoose');

/*
 * This module integrates **mongoose models** into the application. Beside the
 * general structure in mongoose models you can defined some additional variables
 * as shown bellow.
 *
 *    module.exports = {
 *      discriminator: ''   ... optional, default: null
 *    };
 *
 * NOTE: Callbacks are not triggered on operations executed directly on the
 * database. You should `find()` the document first and then update/destroy it.
 *
 * @param {Object} app
 * @param {Array}
 */

module.exports = function(connectors) {

  let connectors = require('../connectors');
  let projectModelsPath = process.cwd()+"/app/models";

  // All registered models.
  let db = {};

  /*
   * Loads model at path (based on http://mongoosejs.com/docs/guide.html).
   *
   * @api private
   */

  let loadModel = function(filePath) {
    let modelData = require(filePath);
    // preparing model schema class
    let schemaInstance = createModelSchema(modelData);
    // preparing model name and table name
    let modelName = modelData.modelName || fileToModel(filePath);
    let tableName = modelData.tableName || modelNameToTableName(modelName);
    // registering mongoose model
    let dbConnection = connectors.object(modelData.connectorName);
    db[modelName] = dbConnection.model(modelName, schemaInstance, tableName);
  };

  /*
   * Loads model at path.
   *
   * @see http://mongoosejs.com/docs/api.html#model_Model-discriminators
   * @api private
   */

  let loadDiscriminator = function(filePath) {
    let discriminatorData = require(filePath);
    let modelData = require(projectModelsPath+"/"+modelNameToFileName(discriminatorData.discriminator));
    let schemaData = _.extend(_.clone(modelData), discriminatorData);
    // preparing model schema class
    let schemaInstance = createModelSchema(schemaData);
    // preparing model name
    let discriminatorModelName = discriminatorData.modelName || fileToModel(filePath);
    // registering mongoose model
    let models = connectors.object(modelData.connectorName);
    db[discriminatorModelName] = models.model(discriminatorData.discriminator).discriminator(discriminatorModelName, schemaInstance);
  };

  /*
   * Creates model schema instance based on model data. Here we implement model
   * behaviour (e.g. timestamp attributes, callbacks).
   *
   * @api private
   */

  let createModelSchema = function(modelData) {
    // new mongoose schema instance
    let schemaInstance = new mongoose.Schema;
    // model attributes
    schemaInstance.add(modelData.attributes);
    // instance methods
    if (modelData.methods) {
      schemaInstance.method(modelData.methods)
    }
    // enabling timestamp auto attributes
    attachModelSchemaTimestampLogic(schemaInstance);
    // attaching callbacks (must be called after timestamp logic)
    if (modelData.callbacks) {
      attachModelSchemaCallbacks(schemaInstance, modelData);
    }
    // returning model schema instance
    return schemaInstance;
  };

  /*
   * Adds the createdAt and updatedAt attributes to the schema instance. These
   * attributes are automatically set and updated.
   *
   * @api private
   */

  let attachModelSchemaTimestampLogic = function(schemaInstance) {
    schemaInstance.add({ createdAt: Date, updatedAt: Date });
    schemaInstance.pre('save', function(next) {
      let date = currentDate('UTC');
      if (!this.createdAt) {
        this.createdAt = date;
      }
      this.updatedAt = date;
      next();
    });
  };

  /*
   * Adds callback functions defined in the model to schema instance. Note that
   * based on this http://github.com/LearnBoost/mongoose/issues/964 callbacks
   * are not performed on operations executed directly on the database. You
   * should `find()` the document first and then update/destroy it.
   *
   * @api private
   */

  let attachModelSchemaCallbacks = function(schemaInstance, modelData) {
    // loop through defined callbacks
    Object.keys(modelData.callbacks).forEach(function(callbackName) {
      // attaching callbacks
      if (callbackName == 'beforeValidate') {
        schemaInstance.pre('validate', function(next) {
          modelData.callbacks.beforeValidate(this);
          next();
        });
      }
      else if (callbackName == 'afterValidate') {
        schemaInstance.post('validate', function(model) {
          modelData.callbacks.afterValidate(this);
        });
      }
      else if (callbackName == 'beforeCreate') {
        schemaInstance.pre('save', function(next) {
          if (this.createdAt.toString()==this.updatedAt.toString()) {
            modelData.callbacks.beforeCreate(this);
          }
          next();
        });
      }
      else if (callbackName == 'afterCreate') {
        schemaInstance.post('save', function(model) {
          if (this.createdAt.toString()==this.updatedAt.toString()) {
            modelData.callbacks.afterCreate(this);
          }
        });
      }
      else if (callbackName == 'beforeUpdate') {
        schemaInstance.pre('save', function(next) {
          if (this.createdAt.toString()!=this.updatedAt.toString()) {
            modelData.callbacks.beforeUpdate(this);
          }
          next();
        });
      }
      else if (callbackName == 'afterUpdate') {
        schemaInstance.post('save', function(model) {
          if (this.createdAt.toString()!=this.updatedAt.toString()) {
            modelData.callbacks.afterUpdate(this);
          }
        });
      }
      else if (callbackName == 'beforeSave') {
        schemaInstance.pre('save', function(next) {
          modelData.callbacks.beforeSave(this);
          next();
        });
      }
      else if (callbackName == 'afterSave') {
        schemaInstance.post('save', function(model) {
          modelData.callbacks.afterSave(this)
        });
      }
      else if (callbackName == 'beforeDestroy') {
        schemaInstance.pre('remove', function(next) {
          modelData.callbacks.beforeDestroy(this);
          next();
        });
      }
      else if (callbackName == 'afterDestroy') {
        schemaInstance.post('remove', function(model) {
          modelData.callbacks.afterDestroy(this);
        });
      }
    });
  };

  /*
   * Returns the model name from file path.
   *
   * @api private
   */

  let fileToModel = function(filePath) {
    let baseName = path.basename(filePath, '.js');
    return inflactor.singularize(_s.classify(baseName));
  };

  /*
   * Returns the table name from model name.
   *
   * @api private
   */

  let modelNameToTableName = function(modelName) {
    return inflactor.pluralize(_s.underscored(_s.camelize(modelName)));
  };

  /*
   * Returns the file name from model name.
   *
   * @api private
   */

  let modelNameToFileName = function(modelName) {
    return inflactor.singularize(_s.underscored(_s.camelize(modelName)));
  };

  /*
   * Returns current date.
   *
   * @api private
   */

  let currentDate = function(region) {
    let d = new time.Date();
    d.setTimezone(region);
    return d;
  };

  // looping through all the files defined in `app/models` directory and loading
  // only modules where `discriminators==null`.
  fs.readdirSync(projectModelsPath).forEach(function(filename) {
    let filePath = projectModelsPath+"/"+filename;
    // ignoring directories
    if (fs.statSync(filePath).isFile()) {
      // loading model data
      let modelData = require(filePath);
      // loading model if not discriminator
      if (!modelData.connector || modelData.connector == 'mongoose') {
        if (!modelData.discriminator) {
          loadModel(filePath);
        }
      }
    }
  });

  // looping through all the files defined in `app/models` directory and load
  // only modules where `discriminators!=null` (note that discriminatored
  // modules inherits from the parent model defined by `discriminators`)
  fs.readdirSync(projectModelsPath).forEach(function(filename) {
    let filePath = projectModelsPath+"/"+filename;
    // ignoring directories
    if (fs.statSync(filePath).isFile()) {
      // loading model schema
      let modelData = require(filePath);
      // loading model if not discriminator
      if (!modelData.connector || modelData.connector == 'mongoose')
        if (modelData.discriminator) {
          loadDiscriminator(filePath);
        }
    }
  });

  // Extending models with custom class methods.
  Object.keys(db).forEach(function(key) {
    let model = db[key];

    /*
     * Finds a record and updates it running the `save` built-in method (`pre`,
     * `post` and `validation` events are triggered).
     *
     * @param {Number} id
     * @param {Object} data
     * @return {Object}
     * @api public
     */

    model.findByIdAndUpdateOne = function*(id, data) {
      let obj = yield model.findById(id).exec();
      _.extend(obj, data);
      return yield obj.save();
    };

    /*
     * Finds a record and removes it running the `remove` built-in method (`pre`,
     * `post` and `validation` events are triggered).
     *
     * @param {Number} id
     * @return {Object}
     * @api public
     */

    model.findByIdAndRemoveOne = function*(id) {
      let obj = yield model.findById(id).exec();
      return yield obj.remove();
    };
  });

  // Returnong a model.
  return db;
};
