'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var gutil = require('gulp-util');
let inflactor = new (require('natural').NounInflector)();
let _ = require('underscore');
let _s = require('underscore.string');
var assetsRoot = process.cwd()+'/app/assets';

/**
 * Application utilities.
 *
 * @api public
 */

module.exports = {

  /**
   * Assets.
   */

  assets: {

    /**
     * Returns the current version of compiled assets by looping through the
     * existing compiled assets.
     *
     * @return {Number}
     * @api public
     */

    get version() {
      var mtime = 0;
      var version = 0;
      // looping through all assets
      glob.sync(assetsRoot+'/**/*').forEach(function(file) {
        // file modified time
        mtime = fs.statSync(file).mtime.getTime();
        // memorizing the latest time
        if (mtime > version) version = mtime;
      });
      // returning the version
      return version;
    },

    /**
     * Returns the asset file relative path.
     *
     * @param {string} source
     * @param {string} version*
     * @return {string}
     * @api public
     */

    path: function(source, version) {
      // path to asset with version
      if (['scripts', 'styles', 'views'].indexOf(source) == 0) {
        version = version || this.version;
        let ext = path.extname(source);
        return gutil.replaceExtension('/assets/'+source, '.'+version+ext);
      }
      // path to asset without version
      return '/assets/'+source;
    }

  },


  /**
   * Inflactor (string manipulation).
   */

  inflactor: {

    /*
     * Returns a pluralized version of name.
     *
     * @param {string} name
     * @return {string}
     * @api private
     */

    pluralize: function(name) {
      return inflactor.pluralize(name);
    },

    /*
     * Returns a singular version of name.
     *
     * @param {string} name
     * @return {string}
     * @api private
     */

    singularize: function(name) {
      return inflactor.singularize(name);
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

  }

};
