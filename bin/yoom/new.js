'use strict';

let fs = require('fs');
let mkdir = require('mkdirp');

// Path to the template directory.
const templatesPath = __dirname+'/../../templates';

// Create application at the given directory `path`.
module.exports = function(projectPath) {

  // creating directory structure
  [ projectPath,
    projectPath+'/app/controllers',
    projectPath+'/app/models',
    projectPath+'/bin',
    projectPath+'/config',
    projectPath+'/spec',
    projectPath+'/logs'
  ].forEach(function(path) {
    mkdir.sync(path);
    console.log(path);
  });

  // copying static files
  [ [templatesPath+'/config/boot.js', projectPath+'/config/boot.js'],
    [templatesPath+'/config/connectors.js', projectPath+'/config/connectors.js'],
    [templatesPath+'/config/routes.js', projectPath+'/config/routes.js'],
    [templatesPath+'/config/settings.js', projectPath+'/config/settings.js'],
    [templatesPath+'/editorconfig', projectPath+'/.editorconfig'],
    [templatesPath+'/gitignore', projectPath+'/.gitignore'],
    [templatesPath+'/package.json', projectPath+'/package.json']
  ].forEach(function(fromTo) {
    let fileSrc = fs.readFileSync(fromTo[0], 'utf-8');
    fs.writeFileSync(fromTo[1], fileSrc);
    console.log(fromTo[1]);
  });

  // installing modules
  require('child_process').spawn("npm", ['install'], {stdio: "inherit", cwd: projectPath });

};
