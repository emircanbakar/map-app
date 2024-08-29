const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://data.ibb.gov.tr',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
