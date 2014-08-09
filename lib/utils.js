'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var assetsRoot = process.cwd()+'/app/assets';
var gutil = require('gulp-util');

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

  }
};
