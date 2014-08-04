module.exports = {

  defaults: {
    'http.port': process.env.HTTP_PORT || 3000,
    'http.address': process.env.HTTP_ADDRESS || '0.0.0.0'
  },

  production: {
  },

  test: {
    'http.port': process.env.HTTP_PORT || 3001
  }
};
