#!/usr/bin/env node --harmony
'use strict';

let path = require('path');
let fs = require('fs');
let program = require('commander');

// Is in root folder?
const inProjectRoot = fs.existsSync(process.cwd()+'/node_modules/yoom');

// Displyas the project's current version.
const packageData = require(inProjectRoot ? process.cwd()+'/node_modules/yoom/package' : '../package')
program
  .version(packageData.version, '-v, --version');

// Creates new project at provided path.
program
  .command('new <name>')
  .description('create new project')
  .action(function(name, args) {
    require('./yoom/new')(path.resolve(process.cwd(), name));
  }).parse(process.argv);

// Starts the application server. This command must be run from project's root
// folder. The command will load project's specific yoom version.
program
  .command('start')
  .option('-i, --hostname <hostname>', 'Set server hostname [marble] (default to `localhost`).')
  .option('-p, --port <port>', 'Set server port (default to `3000`).')
  .option('-e, --environment <environment>', 'Set application environment (default to `development`).')
  .description('start the application server')
  .action(function() {
    console.log(args.port, args.hostname, args.environment);
    require('child_process').spawn("gulp", ['start'], {stdio: "inherit", cwd: process.cwd() });
  });

// Starts the application tests. This command must be run from project's root
// folder. The command will load project's specific yoom version.
program
  .command('open')
  .description('open application in browser')
  .action(function() {
    require('child_process').spawn("gulp", ['open'], {stdio: "inherit", cwd: process.cwd() });
  });

// Starts the application tests. This command must be run from project's root
// folder. The command will load project's specific yoom version.
program
  .command('test')
  .description('run application specs')
  .action(function() {
    require('child_process').spawn("gulp", ['test'], {stdio: "inherit", cwd: process.cwd() });
  });

// Unknown command handling.
program
  .command('*')
  .action(function(env) {
    console.log('Run `yoom --help` for the list of available commands.');
  });

program.parse(process.argv);
