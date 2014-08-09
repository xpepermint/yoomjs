'use strict';

/**
 * Module dependencies.
 */

let _ = require('lodash');
let fs = require('fs');
let swig  = require('swig');
let jade = require('jade');
let ejs = require('ejs');
let coffee = require('coffee-script');
let less = require('less');
let htmlmin = require('html-minifier');
let jsmin = require('uglify-js');
let cssmin = require('clean-css');
let root = process.cwd();
const data = require(root+'/config/renderers');

/**
 * Application content renderers (e.g. *.coffee, *.jade). This module holds
 * content compilers and minifiers.
 *
 * @api public
 */

module.exports = _.merge({

  /**
   * Content compilers.
   */

  compilers: {

    // *.html compiler
    '.swig': function(path, locals) {
      return function(next) {
        swig.setDefaults({ cache: false });
        next(null, swig.compileFile(path)(locals));
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
            sourceFiles: [root+'/app/assets/scripts', root+'/bower_components', root+'/node_modules']
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
            paths: [root+'/app/assets/scripts', root+'/bower_components', root+'/node_modules'] // search for @import
          }, function (err, str) {
            if (err) throw err;
            // returning content
            next(null, str);
          });
        });
      };
    }
  },

  /**
   * Content minifiers.
   */

  minifiers: {

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

  }

}, Object(data));
