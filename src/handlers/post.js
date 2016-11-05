'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = function userPostHandler(req, res, next) {
  res.send(201);
  next();
};
