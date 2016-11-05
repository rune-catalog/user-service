'use strict';

const MongoClient = require('mongodb').MongoClient,
  slug = require('slug'),
  bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = function userPostHandler(req, res, next) {
  let db, salt, password;

  generateSalt()
    .then(s => {
      salt = s;
      return generatePassword(req.body.pass, s);
    })
    .then(pass => {
      password = pass;
      return MongoClient.connect('mongodb://user-db');
    })
    .then(database => {
      db = database;
    })
    .then(() => db.collection('users').insertOne({
      slug: slug(req.body.nick, { lower: true }),
      nick: req.body.nick,
      email: req.body.email,
      password,
      salt
    }))
    .then(() => {
      res.send(201);
      next();
    })
    .catch(err => res.next(err))
    .then(() => db.close());
};

function generateSalt() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function generatePassword(plainText, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, salt, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
