#
# MONGOOSE CONNECTORS
#
# This connector creates a new connection to the MongoDB database.

_mongo = require('mongoose')

load = (data, cb) ->
  uris = Array(data.uris).join(',')
  options = Object(data.options)
  # connecting to db
  conn = _mongo.createConnection uris, options, ->
    cb(conn)
  # registering `connected` event
  conn.on "connected", (err) ->
    console.log("[mongoose] connected uris=#{uris}, options=#{JSON.stringify(options)}")
  # registering 'error' event
  conn.on "error", (err) ->
    console.log("[mongoose] #{err}")

module.exports.load = load
