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
// All registered models are stored in `models` variable. We can access the
// model module as shown bellow.
//
//   require('yoom/lib/models').get({modelName})
//

var util = require('util');
var fs = require('fs');

// Variable where list of loaded models will be stored
var models = {};

// looping through modulules
fs.readdirSync(__dirname+"/models").forEach(function(filename) {
  // loading models for each connector type
  loadedModels = require(__dirname+"/models/"+filename);
  // storing loaded models to `models` variable
  util._extend(models, loadedModels);
});

// Returns a model.
module.exports.get = function(name) {
  return models[name];
};
