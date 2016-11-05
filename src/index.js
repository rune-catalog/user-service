'use strict';

const restify = require('restify');

let server = restify.createServer();
server.use(restify.CORS());
server.use(restify.bodyParser({
  mapParams: false
}));

server.post('/users', require('./handlers/post'));
server.post('/login', require('./handlers/login'));

server.listen(8080, () => {
  console.log(`${server.name} listening on ${server.url}`);
});
