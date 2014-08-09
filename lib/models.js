'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
let fs = require('fs');

/*
 * This module integrates **models** into the application. All models must be
 * defined inside `app/models` directory. Modules are connector-specific. The
 * general structure of the model is shown bellow.
 *
 *     module.exports = {
 *       modelName: '',                    ... optional, default: {filename}.classified.singularized
 *       tableName: '',                    ... optional, default: {filename}.underscored.pluralized
 *       connectorName: '',                ... required (defined inside `config/connectors`)
 *       attributes: {                     ... required (mongoose schema definition (fields, validations))
 *         name: String
 *       },
 *       callbacks: {                      ... optional
 *         beforeValidate: function(){},   ... optional
 *         beforeCreate: function(){},     ... optional
 *         beforeUpdate: function(){},     ... optional
 *         baforeSave: function(){},       ... optional
 *         beforeDestroy: function(){},    ... optional
 *         afterValidate: function(){},    ... optional
 *         afterCreate: function(){},      ... optional
 *         afterUpdate: function(){},      ... optional
 *         afterSave: function(){},        ... optional
 *         afterDestroy: function(){}      ... optional
 *       methods: {                        ... optional (instance methods)
 *         foo: function(){}
 *       }
 *     };
 *
 * IMPORTANT: The job of this module is only to register model class instances
 * and make them available through the `this.all`. We don't care about the
 * sintax on how to query the database.
 *
 * In a controllers the `models` variable is attached to the context thus we
 * can access it as `this.models` (e.g. just as you would access the request).
 *
 * @param {Array} connectors
 * @api public
 */

module.exports = function(connectors) {

  /**
   * List of defined models.
   */

  this.all = {};

  /**
   * Returns a model object.
   *
   * @param {string} name
   * @return {Object}
   * @api public
   */

  this.object = function(name) {
    return this.all[name] || null;
  };

  /**
   * Loads all existing application models.
   *
   * @param {Object} connectors
   * @param
   * @api private
   */

  this.load = function() {
    // looping through modulules
    fs.readdirSync(__dirname+"/models").forEach(function(filename) {
      // loading models for each connector type
      let models = require("./models/"+filename)(connectors);
      // storing loaded models to `models` variable
      _.merge(this.all, models);
    }.bind(this));
    // returning self
  };

  // load on start
  this.load();
};
