'use strict';


// TODO Read arguments as `argv = require('yargs').argv`


let fs = require('fs');
let mkdir = require('mkdirp');
let cp = require('child_process');

// Path to the template directory.
const templatesPath = __dirname+'/../../templates';

// Create application at the given directory `path`.
module.exports = function(projectPath) {

  // creating directory structure
  [ projectPath,
    projectPath+'/app/assets/fonts',
    projectPath+'/app/assets/images',
    projectPath+'/app/assets/scripts',
    projectPath+'/app/assets/styles',
    projectPath+'/app/assets/views',
    projectPath+'/app/controllers',
    projectPath+'/app/models',
    projectPath+'/bin',
    projectPath+'/config',
    projectPath+'/spec',
    projectPath+'/logs',
    projectPath+'/public',
  ].forEach(function(path) {
    mkdir.sync(path);
    console.log(path);
  });

  // copying static files
  [ [templatesPath+'/config/assets.js', projectPath+'/config/assets.js'],
    [templatesPath+'/config/boot.js', projectPath+'/config/boot.js'],
    [templatesPath+'/config/connectors.js', projectPath+'/config/connectors.js'],
    [templatesPath+'/config/routes.js', projectPath+'/config/routes.js'],
    [templatesPath+'/config/settings.js', projectPath+'/config/settings.js'],
    [templatesPath+'/public/index.html', projectPath+'/public/index.html'],
    [templatesPath+'/public/robots.txt', projectPath+'/public/robots.txt'],
    [templatesPath+'/editorconfig', projectPath+'/.editorconfig'],
    [templatesPath+'/gitignore', projectPath+'/.gitignore'],
    [templatesPath+'/bower.json', projectPath+'/bower.json'],
    [templatesPath+'/gulpfile.js', projectPath+'/gulpfile.js'],
    [templatesPath+'/package.json', projectPath+'/package.json']
  ].forEach(function(fromTo) {
    let fileSrc = fs.readFileSync(fromTo[0], 'utf-8');
    fs.writeFileSync(fromTo[1], fileSrc);
    console.log(fromTo[1]);
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
