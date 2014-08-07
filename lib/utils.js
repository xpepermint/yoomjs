'use strict';

//
// UTILS
//
// This file contains general **helper methods**.
//

var fs = require('fs');
var glob = require('glob');

// Project paths.
var scriptsRoot = process.cwd()+'/app/assets/scripts';

// Returns the current version of compiled assets by looping through the
// existing compiled assets.
module.exports.assetsVersion = function() {
  var mtime = 0;
  var version = 0;
  // looping through all assets
  glob.sync(scriptsRoot+'/**/*').forEach(function(file) {
    // file modified time
    mtime = fs.statSync(file).mtime.getTime();
    // memorizing the latest time
    if (mtime > version) version = mtime;
  });
  // returning the version
  return version;
};
