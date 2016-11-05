'use strict';

const restify = require('restify');

let server = restify.createServer();
server.use(restify.CORS());

server.post('/users', require('./handlers/post'));

server.listen(8080, () => {
  console.log(`${server.name} listening on ${server.url}`);
});
