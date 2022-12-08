var express = require('express');
var app = express();
var WebSocket = require('ws');
var http = require('http');
var bodyParser = require('body-parser');

const path = require('path');

const PORT = 4000;

function makeRandomString(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const socket_clients = {};

app.use(bodyParser({ extended: true }));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '/index.html'));
});

app.post(`/:url`, (req, res) => {
  const url = req.params.url;

  const randomStr = makeRandomString(10);

  app.get(`/${randomStr}`, (newReq, newRes) => {
    return newRes.send({ url });
  });

  wss.broadcast(
    JSON.stringify({
      type: 'msg',
      value: `http://localhost:4000/${randomStr}`,
    })
  );
  return res.send();
});

const server = http.createServer(app);

server.listen(PORT);

const wss = new WebSocket.Server({ server });

wss.on('connection', (client) => {
  const client_id = makeRandomString(4);
  socket_clients[client_id] = client;
  client.send(JSON.stringify({ type: 'connect', value: client_id }));
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};

console.log(`I am listening on ${PORT} Port.`);
