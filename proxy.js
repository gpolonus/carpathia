
const fs = require('fs');
const http = require('http');
const httpProxy = require('http-proxy');

//
// Setup our server to proxy standard HTTP requests
//
const proxy = httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 5001
  }
});

const server = http.createServer((req, res) => {
  console.log({ url: req.url });

  let path = __dirname + '/web' + req.url;
  if (!req.url.match(/\/[^\./]+.[^\./]+$/i)) {
    path += '/index.html';
  }

  fs.readFile(path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

//
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
server.on('upgrade', (req, socket, head) => {
  console.log('upgrade', { url: req.url });
  proxy.ws(req, socket, head);
});

server.listen(8080);
