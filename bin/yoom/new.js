var fs = require('fs');
var mkdir = require('mkdirp');
var path = require('path');

// Path to the template directory.
var templatesPath = __dirname+'/../../templates';

// Create application at the given directory `path`.
module.exports = function(path) {

  // creating directory structure
  [ path,
    path+'/app/controllers',
    path+'/app/models',
    path+'/bin',
    path+'/config',
    path+'/spec',
    path+'/logs'
  ].forEach(function(path) {
    mkdir.sync(path);
    console.log(path);
  });

  // copying static files
  [ [templatesPath+'/config/boot.js', path+'/config/boot.js'],
    [templatesPath+'/config/connectors.js', path+'/config/connectors.js'],
    [templatesPath+'/config/routes.js', path+'/config/routes.js'],
    [templatesPath+'/config/settings.js', path+'/config/settings.js'],
    [templatesPath+'/editorconfig', path+'/.editorconfig'],
    [templatesPath+'/gitignore', path+'/.gitignore'],
    [templatesPath+'/package.json', path+'/package.json']
  ].forEach(function(fromTo) {
    fileSrc = fs.readFileSync(fromTo[0], 'utf-8');
    fs.writeFileSync(fromTo[1], fileSrc);
    console.log(fromTo[1]);
  });

  // installing modules
  require('child_process').spawn("npm", ['install'], {stdio: "inherit", cwd: path });

};
