#!/usr/bin/env ./node_modules/yoom/node_modules/.bin/coffee

_path = require('path')
_fs = require('fs')
_program = require('commander')
_package = require('../package')

# Is in root folder?
inProjectRoot = _fs.existsSync _path.join(process.cwd(), 'node_modules', 'yoom')

# Displyas the project's current version.
packageData = require if inProjectRoot then _path.join(process.cwd(), 'node_modules', 'yoom', 'package') else '../package'
_program
  .version(packageData.version, '-v, --version')

# Creates new project at provided path.
_program
  .command('new <name>')
  .description('create new project')
  .action (name) ->
    require('./yoom/new')(_path.resolve(__dirname, name))

# Starts the application server. This command must be run from project's root
# folder. The command will load project's specific yoom version.
_program
  .command('start')
  .description('start the application server')
  .action ->
    require('child_process').spawn("npm", ['start'], {stdio: "inherit", cwd: process.cwd() })

# Starts the application server. This command must be run from project's root
# folder. The command will load project's specific yoom version.
_program
  .command('test')
  .description('run application specs')
  .action ->
    require('child_process').spawn("npm", ['test'], {stdio: "inherit", cwd: process.cwd() })

# Unknown command handling.
_program
  .command('*')
  .action (env) ->
    console.log('Run `yoom --help` for the list of available commands.')

_program.parse(process.argv)
