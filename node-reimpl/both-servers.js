
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

console.log(process.env.NODE_ENV);
const port = process.env.NODE_ENV === 'PROD' ? 80 : 8080
server.listen(port);
console.log(`Listening on ${port}!`);
