_fs = require('fs')
_mkdir = require('mkdirp')
_path = require('path')

# Path to the template directory.
templatesPath = _path.join(__dirname, '..', '..', 'templates')

# Create application at the given directory `path`.
module.exports = (path) ->

  # creating directory structure
  [ path
    _path.join(path, 'app', 'controllers')
    _path.join(path, 'app', 'models')
    _path.join(path, 'bin')
    _path.join(path, 'config')
    _path.join(path, 'spec')
    _path.join(path, 'logs')
  ].forEach (path) ->
    _mkdir.sync path
    console.log(path)

  # copying static files
  [ # /config
    [_path.join(templatesPath, 'config', 'boot.coffee'), _path.join(path, 'config', 'boot.coffee')]
    [_path.join(templatesPath, 'config', 'connectors.coffee'), _path.join(path, 'config', 'connectors.coffee')]
    [_path.join(templatesPath, 'config', 'routes.coffee'), _path.join(path, 'config', 'routes.coffee')]
    [_path.join(templatesPath, 'config', 'settings.coffee'), _path.join(path, 'config', 'settings.coffee')]
    # /
    [_path.join(templatesPath, 'editorconfig'), _path.join(path, '.editorconfig')]
    [_path.join(templatesPath, 'gitignore'), _path.join(path, '.gitignore')]
    [_path.join(templatesPath, 'package.json'), _path.join(path, 'package.json')]
  ].forEach (fromTo) ->
    fileSrc = _fs.readFileSync(fromTo[0], 'utf-8')
    _fs.writeFileSync(fromTo[1], fileSrc)
    console.log(fromTo[1])

  # installing modules
  require('child_process').spawn("npm", ['install'], {stdio: "inherit", cwd: path })
