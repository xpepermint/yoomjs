'use strict';

/*
 * GENERATORS TASKS
 *
 * This module constains tasks for generating project files from command-line.
 */

let gulp = require('gulp');
let gulpRename = require('gulp-rename');
let utils = require('../lib/utils');
let projRoot = process.cwd();
let tplRoot = __dirname+'/../templates';

// Creates a new project file (model, controller, view or test).
module.exports.generate = function(object, name) {
  // source and target extension
  let ext = object == 'view' ? '.html' : '.js';
  // parsing the name of the new filename
  let tarName = utils.inflactor.toFile(name);
  // directory name of an object
  let objDir = utils.inflactor.pluralize(utils.inflactor.singularize(object));
  // relative path to destination/source folder
  let tarPath = object == 'test' ? '/test' : '/app/'+objDir;

  // display created file
  console.log("   created: "+projRoot+tarPath+'/'+tarName+ext);

  // searching for a template file
  return gulp.src(tplRoot+'/app/'+objDir+'/*')
    // rename the file
    .pipe(gulpRename(function(file) {
      file.basename = tarName;
      file.extname = ext;
    // saving to target
    })).pipe(gulp.dest(projRoot+tarPath));
};
