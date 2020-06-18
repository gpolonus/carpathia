
const fs = require('fs');
const http = require('http');
const wss = require('ws').Server;
const { onStart } = require('./server');


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

const ws = new wss({ server });
ws.on('connection', onStart);

server.listen(8080);
console.log('Listening on 8080!');
