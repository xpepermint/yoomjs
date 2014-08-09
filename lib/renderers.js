'use strict';

//
// RENDERERS
//
// This module manage **file renderers**. Renderers compile and minimize content
// of different file types (e.g. *.coffee, *.jade).
//

let _ = require('underscore');
let fs = require('fs');
let swig  = require('swig');
let jade = require('jade');
let ejs = require('ejs');
let coffee = require('coffee-script');
let less = require('less');
let htmlmin = require('html-minifier');
let jsmin = require('uglify-js');
let cssmin = require('clean-css');

// Project path.
let projectRoot = process.cwd();

// Project'c custom renderers.
let projectData = require(projectRoot+'/config/renderers');

// Extending default view compilers with compilers defined in project's config.
module.exports.compilers = _.extend({

  // *.html compiler
  '.swig': function(path, locals) {
    return function(next) {
      swig.compileFile(path, locals, function(err, cls){
        next(null, cls());
      });
    };
  },

  // *.jade compiler
  '.jade': function(path, locals) {
    return function(next) {
      next(null, jade.renderFile(path, locals));
    };
  },

  // *.js compiler
  '.ejs': function(path, locals) {
    return function(next) {
      // loading file content
      fs.readFile(path, 'utf8', function(err, str) {
        if (err) throw err;
        // returning compiled source
        next(null, ejs.render(str, locals));
      });
    };
  },

  // *.coffee compiler
  '.coffee': function (path, locals) {
    return function(next) {
      // loading file content
      fs.readFile(path, 'utf8', function(err, str) {
        if (err) throw err;
        // returning compiled source
        next(null, coffee.compile(str, {
          bare: false,
          header: false,
          sourceRoot: false,
          sourceFiles: [projectRoot+'/app/assets/scripts', projectRoot+'/bower_components']
        }));
      });
    };
  },

  // *.less compiler
  '.less': function (path, locals) {
    return function(next) {
      // loading file content
      fs.readFile(path, 'utf8', function(err, str) {
        // compiling source
        less.render(str, {
          filename: path,
          paths: [projectRoot+'/app/assets/scripts', projectRoot+'/bower_components'] // search for @import
        }, function (err, str) {
          if (err) throw err;
          // returning content
          next(null, str);
        });
      });
    };
  }
}, Object(projectData.compilers));

// Extending default view compilers with compilers defined in project's config.
module.exports.minifiers = _.extend({

  // .html minifier
  '.html': function(str) {
    return function(next) {
      // returning minified content
      next(null, htmlmin.minify(str, {
        collapseWhitespace: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        minifyJS: true,
        minifyCSS: true
      }));
    };
  },

  // .html minifier
  '.js': function(str) {
    return function(next) {
      // returning minified content
      next(null, jsmin.minify(str, { fromString: true }).code);
    };
  },

  // .html minifier
  '.css': function(str) {
    return function(next) {
      // returning minified content
      next(null, (new cssmin({})).minify(str));
    };
  }

}, Object(projectData.minifiers));
