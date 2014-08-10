#!/usr/bin/env node --harmony
'use strict';

/**
 * Module dependencies.
 */

let path = require('path');
let fs = require('fs');
let program = require('commander');

// Is in root folder?
let inProjectRoot = fs.existsSync(process.cwd()+'/node_modules/yoom');

/*
 * Displyas the project's current version.
 */

let packageData = require(inProjectRoot ? process.cwd()+'/node_modules/yoom/package' : '../package')
program
  .version(packageData.version, '-v, --version');

/*
 * Creates new project at provided path.
 */

program
  .command('new <path>')
  .description('create new project')
  .action(function(name, args) {
    require('./yoom/new')(path.resolve(process.cwd(), name));
  });

/*
 * Creates a new project file (model, controller, view or test).
 */

program
  .command('generate <object> <type>')
  .alias('g')
  .description('start the application server')
  .action(function(object, type) {
    require('../tasks/generator').generate(object, type);
  });

/*
 * Starts the application server. This command must be run from project's root
 * folder. The command will load project's specific yoom version.
 */

program
  .command('start')
  .alias('s')
  .description('start the application server')
  // app
  .option('-i, --hostname <hostname>', 'Set server hostname (default to `localhost`).')
  .option('-p, --port <port>', 'Set server port (default to `3000`).')
  .option('-e, --environment <environment>', 'Set application environment (default to `development`).')
  .option('-s, --secret <environment>', 'Set application secret (default to `no-secret`).')
  // dev
  .option('-l, --livereload [enable]', 'Enable live reload (enabled in development).')
  .option('-r, --restart [enable]', 'Enable automatic restart if content changes (enabled in development).')
  .option('-a, --assets [enable]', 'Enable automatic assets precompiling (enabled in development).')
  .action(function(args) {
    let opts = {};
    if (args.livereload != undefined) opts.livereload = args.livereload!='false';
    if (args.restart != undefined) opts.restart = args.restart!='false';
    if (args.assets != undefined) opts.assets = args.assets!='false';
    require('../tasks/application').start(opts);
  });

/*
 * Precompiles project assets.
 */

program
  .command('build')
  .alias('b')
  .description('Precompile application assets.')
  .action(function(args) {
    require('../tasks/assets').build();
  });

/*
 * Removes the existing project assets.
 */

program
  .command('clean')
  .alias('c')
  .description('Remove application assets.')
  .action(function(args) {
    require('../tasks/assets').clean();
  });

/*
 * Opens the application in browser.
 */

program
  .command('open')
  .alias('o')
  .description('Open application in browser.')
  .action(function() {
    require('../tasks/application').open()
  });

/*
 * Runs the application tests. This command must be run from project's root
 * folder. The command will load project's specific yoom version.
 */

program
  .command('test [path]')
  .alias('t')
  .description('Run application specs.')
  .option('-a, --autotest [enable]', 'Rerun automatically when a spec changes.')
  .option('-V, --verbose [enable]', 'Print extra information per each test run.')
  .action(function(path, args) {
    let opts = [];
    if (args.autotest != undefined) opts.push('--autotest');
    if (args.verbose != undefined) opts.push('--verbose');
    opts.push(path || process.cwd()+'/spec');
    require('child_process').spawn(__dirname+"/../node_modules/.bin/jasmine-node", opts, {stdio: "inherit", cwd: process.cwd() });
  });

/*
 * Unknown command handling.
 */

program
  .command('*')
  .action(function(env) {
    console.log('Run `yoom --help` for the list of available commands.');
  });

// parsing arguments
program.parse(process.argv);
