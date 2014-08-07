'use strict';

//
// BOOT TASKS
//
// This file contains tasks related to the **application boot** process. These
// methods are ment to be triggered by a project's `gulpfile.js`.
//
//    gulp.task('start', function() { app.start() });
//    gulp.task('open', function() { app.open() });
//
// Note that `start` task must exist inside project's `gulpfile.js` because the
// `npm` and `yoom` commands relie on it.
//

var gulp = require('gulp');
var es = require('event-stream');
var util = require('util');
var livereload = require('gulp-livereload');
var assets = require('./assets');
var env = process.env.NODE_ENV || 'development';

// After loading assets module, we load project's gulpfile to load possible
// assets module extensions (e.g. compilers variable definitions).
require(process.cwd()+'/gulpfile');

// Starts the application server. We can pass configuration options. See the
// list of available values bellow.
//
//    livereload    ... Automatic browser reloads (set to `true` in development
//                      and disabled in production by default).
//    restart       ... Automatic server reloads on application files changes
//                      (set to `true` in development and disabled in
//                      production by default).
//    assets        ... Automatic assets compiling (set to `true` in development
//                      and disabled in production by default).
//
module.exports.start = function(options) {
  var cfg = util._extend({
    livereload: env=='development',
    restart: env=='development',
    assets: env=='development'
  }, options);

  // starting live updates over port 35729 to the prowser if enabled
  if (cfg.livereload) livereload.listen({ silent: false });

  // watching files which need the server restart when changed
  if (cfg.restart) gulp.watch(['app/controllers/**/*', 'app/models/**/*', 'config/**/*'], onServerRestart);
  // watching assets which can be reloaded withour server restart
  if (cfg.assets) gulp.watch(['app/views/**/*', 'app/assets/**/*', 'public/**/*'], onAssetsChange);
  // watching for server restart event
  gulp.watch(['.cache/boot.state'], afterServerRestart);

  // starting server
  onServerRestart();

  // child server instance
  var server;
  // Triggered when the server should be started/restarted.
  function onServerRestart(e) {
    // kill the child process if the application has already been started
    if (server) server.kill();
    // spawn a new child process
    console.log('[yoom] spawning server ...')
    server = require('child_process').spawn("node", ['--harmony', './config/boot.js'], {stdio: "inherit", cwd: process.cwd() });
    // prevent infinite recursion
    process.on('uncaughtException', function(err) {
      console.log(err);
      server.kill();
      process.kill();
    });
  };

  // Triggered when the browser should be ask over livereload to refresh.
  function onLivereload(e) {
    console.log('[yoom] reloading ...')
    if (cfg.livereload) livereload.changed();
  }

  // Triggered when the server has been restarted.
  function afterServerRestart(e) {
    onAssetsChange(e);
  }

  // Triggered when the assets files have been changed.
  function onAssetsChange(e) {
    console.log('[yoom] rebuilding assets ...')
    // removing assets cache directory
    require('rimraf')(process.cwd()+'/.cache/public/assets', function() {
      // compiling assets and reloading browser
      assets.compile().on('end', onLivereload);
    });
  };
};

// Opens a browser and navigates to applications root address. Optionally we can
// send a name of our prefered browser as an argument.
module.exports.open = function(browser) {
  require('open')('http://localhost:3000', browser); // TODO - change data
};
