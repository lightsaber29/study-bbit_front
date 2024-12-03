const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("Setting up proxy");

  app.use(
    '/api/express',
    createProxyMiddleware({
      // target: 'http://localhost:6081', // Node.js 서버로 프록시
      target: 'https://node.studybbit.site', // Node.js 서버로 프록시
      changeOrigin: true,
      logLevel: 'debug'
    })
  );

  app.use(
    '/api', // proxy가 필요한 path prameter를 입력합니다.
    createProxyMiddleware({
      // target: 'http://localhost:8080', //타겟이 되는 api url를 입력합니다.
      target: 'https://studybbit.store:8080', //타겟이 되는 api url를 입력합니다.
      changeOrigin: true, // 대상 서버 구성에 따라 호스트 헤더가 변경되도록 설정하는 부분입니다.
      logLevel: 'debug'
    })
  );
};