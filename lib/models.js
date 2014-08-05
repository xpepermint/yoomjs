'use strict';

//
// MODELS
//
// This module integrates **models** into the application. All models must be
// defined inside `app/models` directory. Modules are connector-specific. The
// general structure of the model is shown bellow.
//
//    module.exports = {
//      modelName: '',                    ... optional, default: {filename}.classified.singularized
//      tableName: '',                    ... optional, default: {filename}.underscored.pluralized
//      connectorName: '',                ... required (defined inside `config/connectors`)
//      attributes: {                     ... required (mongoose schema definition (fields, validations))
//        name: String
//      },
//      callbacks: {                      ... optional
//        beforeValidate: function(){},   ... optional
//        beforeCreate: function(){},     ... optional
//        beforeUpdate: function(){},     ... optional
//        baforeSave: function(){},       ... optional
//        beforeDestroy: function(){},    ... optional
//        afterValidate: function(){},    ... optional
//        afterCreate: function(){},      ... optional
//        afterUpdate: function(){},      ... optional
//        afterSave: function(){},        ... optional
//        afterDestroy: function(){}      ... optional
//      methods: {                        ... optional (instance methods)
//        foo: function(){}
//      }
//    };
//
// All registered models are stored in the `models` variable. We can access a
// model as shown bellow.
//
//   require('yoom').models.{modelName};
//
// In a controllers the `models` variable is attached to the context thus we
// can access it as `this.models` (e.g. just as you would access the request).
//

let util = require('util');
let fs = require('fs');
let app = require('../index');

// Variable where list of loaded models will be stored
let models = {};

// looping through modulules
fs.readdirSync(__dirname+"/models").forEach(function(filename) {
  // loading models for each connector type
  let loadedModels = require(__dirname+"/models/"+filename);
  // storing loaded models to `models` variable
  util._extend(models, loadedModels);
});

// attaching models to application instance
app.models = module.extends = models;
app.use(function*(next) {
  this.models = models;
  yield next;
});
