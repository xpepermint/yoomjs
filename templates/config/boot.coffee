# app instance
_app = require('yoom')
# adding request logger middleware
_logger = require('morgan')
_app.use _logger('combined')
# lifting application
_app.start()
