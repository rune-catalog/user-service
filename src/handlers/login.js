'use strict';

const UnauthorizedError = require('restify').UnauthorizedError,
  MongoClient = require('mongodb').MongoClient,
  bcrypt = require('bcrypt'),
  config = require('config'),
  jwt = require('jsonwebtoken');

module.exports = function loginHandler(req, res, next) {
  let db;
  let secret = config.get('jwtSecret');

  MongoClient.connect('mongodb://user-db/rune')
    .then(database => {
      db = database;
      return db.collection('users').findOne({ email: req.body.email });
    })
    .then(user => {
      if (!user) throw new UnauthorizedError();
      return authenticate(req.body.password, user.password)
        .then(() => user);
    })
    .then(user => generateToken(user.nick, user.slug, secret))
    .then(token => {
      res.json(token);
      next();
    })
    .catch(err => next(err))
    .then(() => db.close());
};

function authenticate(plaintextPass, hashedPass) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plaintextPass, hashedPass, (err, res) => {
      if (err) {
        reject(err);
      } else if (!res) {
        reject(new UnauthorizedError());
      } else {
        resolve();
      }
    });
  });
}

function generateToken(userNick, userSlug, secret) {
  return jwt.sign({
    nick: userNick,
    slug: userSlug
  }, secret);
}
