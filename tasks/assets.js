'use strict';

/**
 * Module dependencies.
 */

let co = require('co');
let fs = require('fs');
let path = require('path');
let es = require('event-stream');
let gulp = require('gulp');
let gutil = require('gulp-util');
let gulpRimraf = require('gulp-rimraf');
let gulpConcat = require('gulp-concat');
let gulpRename = require('gulp-rename');
let autil =require('../lib/utils/assets');
let renderers = require('../lib/renderers');
let thunk = require('thunkify');

/**
 * Helpers
 */

let projectRoot = process.cwd();
let cacheAssets = projectRoot+'/.cache/public/assets';
let assetsRoot = projectRoot+'/app/assets';
let assetsData = require(projectRoot+'/config/assets');

/*
 * Returns compiled source file as stream. This function uses `renderers` for
 * compiling and minimizing the content.
 *
 * @param {string} ext
 * @param {string} source
 * @return {stream}
 */

let src = function(ext, source) {
  // returning a stream with converted source file
  return gulp.src(source).pipe(es.map(function(file, next) {
    co(function*(){
      // is external lib (not project's source file)
      let islib = source.indexOf(projectRoot) != -1;
      // received file extension
      let fext = path.extname(file.path);
      // compiling file content
      let str;
      if (renderers.compilers[fext] && islib) str = yield renderers.compilers[fext](file.path, {});
      else str = yield thunk(fs.readFile)(file.path, 'utf8');
      // minifying content
      if (renderers.minifiers[ext] && islib) str = yield renderers.minifiers[ext](str);
      // changing file's content
      file.contents = new Buffer(str);
      // renaming file extension
      file.path = gutil.replaceExtension(file.path, ext);
      // return file
      next(null, file);
    })();
  }));
};

/*
 * Converts `from` files to `ext` type and saves the compiled and minified files
 * at the provided `to` path.
 *
 *    ext       ... What extension should the files have (e.g. `.js` or `.css`).
 *    from      ... Where to look for source files.
 *    to        ... Where to save converted files (e.g. `.cache/public/assets`).
 *
 * @param {string} ext
 * @param {string} from
 * @param {string} to
 * @return {stream}
 */

let createFiles = function(ext, from, to) {
  // list of source streams
  let srcs = [];
  // known extensions
  let exts = Object.keys(renderers.compilers);
  exts.push(ext);
  // looping through known extensions
  Object.keys(renderers.compilers).forEach(function(extension) {
    // memorizing the returned stream
    srcs.push(
      // creating asset file (stil in memory, saved at `gulp.dest`)
      src(ext, from+'/**/*'+extension));
  });
  // returning a stream
  return es.merge.apply(this, srcs)
    // attaching file version
    .pipe(gulpRename(function(file) { file.basename = file.basename+'.'+autil.version }))
    // saving files to the destination
    .pipe(gulp.dest(to));
};

/*
 * Returns a stream which creates compiled bundles. A bundle is a file where
 * multiple files are merged into one single file. Method requires 4 parameters.
 *
 *    ext       ... What extension should the files have (e.g. `.js` or `.css`).
 *    bundles   ... Object of arrays with of files to merge. The object bellow
 *                  will create a file `{to}/all.{ext}` with the content of
 *                  all files listed.
 *
 *                   { 'all': ['test.coffee', 'angular/angular.js'] }
 *
 *    from      ... Where to look for files. Note that except that path the
 *                  method will also check the `bower_components` path.
 *    to        ... Where to save new files (e.g. `.cache/public/assets`).
 *
 * @param {string} ext
 * @param {Object} bundles
 * @param {string} from
 * @param {string} to
 * @return {stream}
 */

let createBundles = function(ext, bundles, from, to) {
  let streams = [];
  // looping through each defined bundle
  Object.keys(bundles).forEach(function(bname) {
    // creating list of file paths
    let filePaths = [];
    bundles[bname].forEach(function(source) {
      // where we search for the file
      let validPaths = [from+'/'+source, 'bower_components/'+source, 'node_modules/'+source];
      // looping throughvalid paths
      for (let i in validPaths) {
        // add valid path to filePaths if the path is valid
        if (fs.existsSync(validPaths[i])) {
          filePaths.push(validPaths[i]);
          break;
        }
      }
    });
    // creating list of source streams (list of files)
    let srcs = [];
    filePaths.forEach(function(filePath) {
      // memorizing the returned stream
      srcs.push(
        // creating asset file (stil in memory, saved at `gulp.dest`)
        src(ext, filePath));
    });
    // creating a bundle stream and memorizing it for later handling
    streams.push(
      // memorizing asset files streams
      es.merge.apply(this, srcs)
        // merging all asset files to a single file with attached version
        .pipe(gulpConcat(bname+'.'+autil.version+ext))
        // saving merged file to destination
        .pipe(gulp.dest(to)
    ));
  });
  // returning bundle streams
  return es.merge.apply(this, streams);
};

/**
 * Tasks.
 */

module.exports = {

  /*
   * Deletes compiled assets.
   *
   * @return {stream}
   * @api public
   */

  clean: function() {
    // because of race conditions, we have to move the folder first (TODO other solution?)
    if (fs.existsSync(cacheAssets)) fs.renameSync(cacheAssets, cacheAssets+'.deleted');
    return gulp.src(cacheAssets+'.deleted', {read: false}).pipe(gulpRimraf());
  },

  /*
   * Compiles `scripts` assets.
   *
   * @return {stream}
   * @api public
   */

  compileScripts: function() {
    return es.merge(
      createFiles('.js', assetsRoot+'/scripts', cacheAssets+'/scripts'),
      createBundles('.js', Object(assetsData.scripts), assetsRoot+'/scripts', cacheAssets+'/scripts'));
  },

  /*
   * Compiles `styles` assets.
   *
   * @return {stream}
   * @api public
   */

  compileStyles: function() {
    return es.merge(
      createFiles('.css', assetsRoot+'/styles', cacheAssets+'/styles'),
      createBundles('.css', Object(assetsData.styles), assetsRoot+'/styles', cacheAssets+'/styles'));
  },

  /*
   * Compiles `views` assets.
   *
   * @return {stream}
   * @api public
   */

  compileViews: function() {
    return createFiles('.html', assetsRoot+'/views', cacheAssets+'/views');
  },

  /*
   * Copy other document to the public assets directory.
   *
   * @return {stream}
   * @api public
   */

  copyUnknown: function() {
    return gulp.src([assetsRoot+'/**/*', '!'+assetsRoot+'/styles', '!'+assetsRoot+'/scripts', '!'+assetsRoot+'/views']).pipe(gulp.dest(cacheAssets));
  },

  /*
   * Compiles all assets.
   *
   * @return {stream}
   * @api public
   */

  compile: function() {
    return es.merge(
      this.compileScripts(),
      this.compileStyles(),
      this.compileViews(),
      this.copyUnknown() );
  },

  /*
   * Cleans the assets directory and recompiles all assets.
   *
   * @return {stream}
   * @api public
   */

  build: function() {
    this.clean();
    return this.compile();
  }

};
