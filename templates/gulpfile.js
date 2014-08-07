'use strict';

var gulp = require('gulp');
var app = require('yoom/tasks/boot');
var assets = require('yoom/tasks/assets');

// assets.compilers['.scss'] = function() {
//   return require('gulp-sass')({ loadPath: require('node-bourbon').includePaths, cacheLocation: '.cache/sass' })
// };

// Starts the application server.
gulp.task('start', function() { app.start() });

// Opens a browser and navigates to applications root address.
gulp.task('open', function() { app.open() });

// Cleans compiled assets (at .public/assets).
gulp.task('assets:clean', function() { return assets.clean() });

// Compiles assets (to .public/assets).
gulp.task('assets:compile', function() { return assets.compile() });

// Executes 'assets:clean' and 'assets:compile' in sequence.
gulp.task('assets:build', ['assets:clean'], function() { return gulp.start('assets:compile') });
