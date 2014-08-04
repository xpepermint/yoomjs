#!/usr/bin/env node --harmony

var path = require('path');
var fs = require('fs');
var program = require('commander');

// Is in root folder?
var inProjectRoot = fs.existsSync(process.cwd()+'/node_modules/yoom');

// Displyas the project's current version.
var packageData = require(inProjectRoot ? process.cwd()+'/node_modules/yoom/package' : '../package')
program
  .version(packageData.version, '-v, --version');

// Creates new project at provided path.
program
  .command('new <name>')
  .description('create new project')
  .action(function(name) {
    require('./yoom/new')(path.resolve(__dirname, name));
  });

// Starts the application server. This command must be run from project's root
// folder. The command will load project's specific yoom version.
program
  .command('start')
  .description('start the application server')
  .action(function() {
    require('child_process').spawn("npm", ['start'], {stdio: "inherit", cwd: process.cwd() });
  });

// Starts the application tests. This command must be run from project's root
// folder. The command will load project's specific yoom version.
program
  .command('test')
  .description('run application specs')
  .action(function() {
    require('child_process').spawn("npm", ['test'], {stdio: "inherit", cwd: process.cwd() });
  });

// Unknown command handling.
program
  .command('*')
  .action(function(env) {
    console.log('Run `yoom --help` for the list of available commands.');
  });

program.parse(process.argv);
