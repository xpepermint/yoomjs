'use strict';

module.exports = {

  defaults: {
    'httpPort': process.env.HTTP_PORT || 3000,
    'httpAddress': process.env.HTTP_ADDRESS || '0.0.0.0'
  },

  production: {
  },

  test: {
    'httpPort': process.env.HTTP_PORT || 3001
  }
};
