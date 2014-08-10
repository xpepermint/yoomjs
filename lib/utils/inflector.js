'use strict';

/**
 * Module dependencies.
 */

let _s = require('underscore.string');
let path = require('path');
let infl = new (require('natural').NounInflector)();

/**
 * String/Naming utilities.
 *
 * @api public
 */

module.exports = {

  /*
   * Returns a pluralized version of name.
   *
   * @param {string} name
   * @return {string}
   * @api private
   */

  pluralize: function(name) {
    return infl.pluralize(name);
  },

  /*
   * Returns a singular version of name.
   *
   * @param {string} name
   * @return {string}
   * @api private
   */

  singularize: function(name) {
    return infl.singularize(name);
  },

  /*
   * Returns a model name from a file path.
   *
   * @param {string} name
   * @return {string}
   * @api private
   */

  toModel: function(name) {
    let baseName = path.basename(name, path.extname(name));
    return this.singularize(_s.classify(baseName));
  },

  /*
   * Returns the controller name from file path.
   *
   * @param {string} file
   * @return {string}
   * @api private
   */

  toController: function(name) {
    return this.pluralize(this.toModel(name));
  },

  /*
   * Returns a file name from a name (e.g. model name or controler).
   *
   * @params {string} name
   * @return {string}
   * @api private
   */

  toFile: function(name) {
    return _s.underscored(name);
  },

  /*
   * Returns a database table name from a name (e.g. model name or controler).
   *
   * @params {string} name
   * @return {string}
   * @api private
   */

  toTable: function(name) {
    return this.pluralize(this.toFile(name));
  }

};
