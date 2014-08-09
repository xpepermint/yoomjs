'use strict';

/**
 * Module dependencies.
 */

const data = require(process.cwd()+"/config/connectors");

/**
 * This module integrates **connectors** into the application. A connector
 * provides a connection to a database. The connectors are used by models. You
 * can have as many connectors per project as you like (multiple databases). The
 * connectors must be defined inside `config/connectors` as shown bellow.
 *
 *   module.exports =
 *     {customcname}:
 *       connector: {connectorType}
 *       {connectorSpecificData}
 *
 * @api private
 */

module.exports = function() {

  /**
   * List of defined connectors.
   */

  this.all = {};

  /**
   * Returns a database connector.
   *
   * @param {string} name
   * @return {Object}
   * @api public
   */

  this.object = function(name) {
    return this.all[name] || null;
  };

  /**
   * Connects to all databases required by the application.
   *
   * @param {CallbackFunction} next
   * @api public
   */

  var self = this;
  this.connect = function(next) {
    // list of defined connectors
    let cnames = Object.keys(data);
    // recursive function that loads each connector
    let loadNext = function(nextIndex) {
      let cname = cnames[nextIndex];
      let cdata = data[cname];
      if (cdata) {
        // connection to database
        require("./connectors/"+cdata.connector)(cdata, function(conn) {
          // saving connection instance
          self.all[cname] = conn;
          // connection to the next database
          loadNext(nextIndex+1);
        });
      }
      else {
        // finish
        next();
      }
    };
    // start loading connectors
    loadNext(0);
  };

  /**
   * Disconnects from all connected application databases.
   *
   * @api public
   */

  this.disconnect = function(next) {
    // list of defined connectors
    let cnames = Object.keys(connections);
    // recursive function that disconnects each connector
    let disconnectNext = function(nextIndex) {
      let cname = cnames[nextIndex];
      if (cname) {
        this.all[cname].close();
        delete this.all[cname];
        disconnectNext(nextIndex+1);
      }
      else {
        next();
      }
    }.bind(this);
    // start loading connectors
    disconnectNext(0);
  };

};
