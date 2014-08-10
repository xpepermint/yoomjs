'use strict';

/**
 * Module dependencies.
 */

let gulp = require('gulp');
let gulpRename = require('gulp-rename');
let iutils = require('../lib/utils/inflector');

let projRoot = process.cwd();
let tplRoot = __dirname+'/../templates';

/*
 * Creates a new project file (model, controller, view or test).
 *
 * @param {string} object
 * @param {string} name
 * @return {stream}
 */

module.exports.generate = function(object, name) {
  // source and target extension
  let ext = object == 'view' ? '.html' : '.js';
  // parsing the name of the new filename
  let tarName = iutils.toFile(name);
  // directory name of an object
  let objDir = iutils.pluralize(iutils.singularize(object));
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
