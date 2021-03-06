'use strict';

/**
 * Module dependencies.
 */

let _ = require('underscore');
let path = require('path');
let fs = require('fs');
let mkdir = require('mkdirp');
let cp = require('child_process');
let readdirr = require('fs-readdir-recursive');

/**
 * Create application at the given directory `path`.
 */

module.exports = function(projectPath) {

  // Path to the template directory.
  let templatesPath = __dirname+'/../../templates';

  // defining variables that will be replaced in templates
  let vars = {
    'name': _.last(projectPath.split(path.sep)).toLowerCase()
  };

  // Returns parsed string with embeded `vars`.
  let parser = function(str) {
    Object.keys(vars).forEach(function(key) {
      str = str.replace('{{== '+key+' ==}}', vars[key]);
    });
    return str;
  };

  // creating directory structure
  [ '.cache',
    'app/assets/fonts',
    'app/assets/images',
    'app/assets/scripts',
    'app/assets/styles',
    'app/assets/views',
    'app/controllers',
    'app/models',
    'app/views',
    'config',
    'spec',
    'logs',
    'public'
  ].forEach(function(path) {
    mkdir.sync(projectPath+'/'+path);
    console.log('   created: '+path);
  });

  // copying static files
  readdirr(templatesPath).forEach(function(filename) {
    let from = templatesPath+"/"+filename;
    let to = projectPath+"/"+filename;
    // ignoring directories
    if (['.DS_Store'].indexOf(filename) == -1 && fs.statSync(from).isFile()) {
      // renaming '_.' files to '.' (ignored by default)
      to = to.replace('/_.', '/.');
      // display created file
      console.log('   created: '+to);
      // reading source file content
      let fromSrc = parser(fs.readFileSync(from, 'utf-8'));
      // writing content to new destination
      fs.writeFileSync(to, fromSrc);
    }
  });

  // installing npm modules
  let npm = cp.spawn("npm", ['install'], {stdio: "inherit", cwd: projectPath });

  // installing bowser components
  let bower = cp.spawn("bower", ['install'], {stdio: "inherit", cwd: projectPath });

  // killing children in case of error
  process.on('uncaughtException', function(err) {
    console.log(err);
    npm.kill();
    bower.kill();
    process.kill();
  });
};
