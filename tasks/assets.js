'use strict';

//
// ASSETS TASKS
//
// This module constains tasks for managing the **assets pipeline**. All the
// tasks returns a `stream` thus every task can be piped further.
//

var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var gulp = require('gulp');
var gulpRimraf = require('gulp-rimraf');
var gulpConcat = require('gulp-concat');
var gulpRename = require('gulp-rename');
var utils = require('../lib/utils');

// Project's paths.
var cacheAssets = process.cwd()+'/.cache/public/assets';
var scriptsPublic = cacheAssets+'/scripts';
var stylesPublic = cacheAssets+'/styles';
var scriptsRoot = process.cwd()+'/app/assets/scripts';
var stylesRoot = process.cwd()+'/app/assets/styles';

// Project's assets data.
var assetsData = require(process.cwd()+'/config/assets');

// Returns compiled stream source file. If the provided `source` file has an
// extension that exists inside `exports.compilers[{ext}]` then the file is send
// through the plugin.
var src = module.exports.src = function(ext, source) {
  return gulp.src(source).pipe( compiler()).pipe( minifier());
  // Returns a compiler stream.
  function compiler() {
    var sext = path.extname(source);
    return exports.compilers[sext] ? exports.compilers[sext]() : es.map(function(data, next) { next(null, data) });
  }
  // Return a minifier stream.
  function minifier() {
    // not minifying bower components
    var minify = source.indexOf('bower_components') != 0;
    return minify && exports.minifiers[ext] ? exports.minifiers[ext]() : es.map(function(data, next) { next(null, data) });
  }
};

// Returns a stream which recursevly compiles files found at `from` and copy
// them at `to`.
//
//    ext       ... What extension should the files have (e.g. `.js` or `.css`).
//    from      ... Where to look for files.
//    to        ... Where to save new files (e.g. `.cache/public/assets`).
//
var createFiles = function(ext, from, to) {
  var srcs = [];
  if (!exports.compilers[ext]) srcs.push(src(ext, from+'/**/*'+ext, exports.compilers));
  Object.keys(exports.compilers).forEach(function(extension) {
    srcs.push(src(ext, from+'/**/*'+extension, exports.compilers));
  });
  return es.merge.apply(this, srcs)
    .pipe(gulpRename(function(path) { path.basename = path.basename+'.'+utils.assetsVersion() }))
    .pipe(gulp.dest(to));
};

// Returns a stream which creates compiled bundles. A bundle is a file where
// multiple files are merged into one single file. Method requires 4 parameters.
//
//    ext       ... What extension should the files have (e.g. `.js` or `.css`).
//    bundles   ... Object of arrays with of files to merge. The object bellow
//                  will create a file `{to}/all.{ext}` with the content of
//                  all files listed.
//
//                   { 'all': ['test.coffee', 'angular/angular.js'] }
//
//    from      ... Where to look for files. Note that except that path the
//                  method will also check the `bower_components` path.
//    to        ... Where to save new files (e.g. `.cache/public/assets`).
//
var createBundles = function(ext, bundles, from, to) {
  var streams = [];
  // looping through each defined bundle
  Object.keys(bundles).forEach(function(bname) {
    // creating list of file paths
    var filePaths = [];
    bundles[bname].forEach(function(source) {
      // where we search for the file
      var validPaths = [
        from+'/'+source,
        'bower_components/'+source];
      // looping throughvalid paths
      for (var i in validPaths) {
        // add valid path to filePaths if the path is valid
        if (fs.existsSync(validPaths[i])) {
          filePaths.push(validPaths[i]);
          break;
        }
      }
    });
    // creating list of source streams (list of files)
    var srcs = [];
    filePaths.forEach(function(filePath) {
      srcs.push(src(ext, filePath));
    });
    // creating a bundle stream and memorizing it for later handling
    streams.push(
      es.merge.apply(this, srcs)
        .pipe(gulpConcat(bname+'.'+utils.assetsVersion()+ext))
        .pipe(gulp.dest(to)));
  });
  // returning bundle streams
  return es.merge.apply(this, streams);
};

// Predefined compilers for compiling assets. This data can be extended inside
// project's `gulpfile.js` to enable additional compilers.
module.exports.compilers = {
  // handling `coffescript` files
  '.coffee': function (){ return require('gulp-coffee')() },
  // handling `less` files
  '.less': function() { return require('gulp-less')({ paths: 'bower_components/lesshat/build' }) }
};

// Predefined minifiers for assets optimizations. This data can be modified
// inside project's `gulpfile.js`.
module.exports.minifiers = {
  // handling `scripts` files
  '.js': function() { return require('gulp-uglify')() },
  // handling `styles` files
  '.css': function() { return require('gulp-minify-css')() }
};

// Deletes compiled assets.
module.exports.clean = function() {
  return gulp.src(cacheAssets, {read: false}).pipe(gulpRimraf());
};

// Compiles `scripts` assets.
module.exports.compileScripts = function() {
  return es.merge(
    createBundles('.js', Object(assetsData.scripts), scriptsRoot, scriptsPublic),
    createFiles('.js', scriptsRoot, scriptsPublic));
};

// Compiles `styles` assets.
module.exports.compileStyles = function() {
  return es.merge(
    createFiles('.css', stylesRoot, stylesPublic),
    createBundles('.css', Object(assetsData.styles), stylesRoot, stylesPublic));
};

// Compiles all assets.
module.exports.compile = function() {
  return es.merge(
    this.compileScripts(),
    this.compileStyles());
};
