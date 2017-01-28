'use strict';

var User = require('./models/users');
var basicAuth = require('basic-auth');
var bcrypt = require('bcrypt');


var auth = function (req, res, next){

  // Parse the Authorization header credentials
  var user = basicAuth(req);


  function unauthorised (res) {
    res.sendStatus(401);
  }

  // if the user, user.name or user.pass don't exist
  if (!user || !user.name || !user.pass) {
    // return unauthorised
    return unauthorised(res);
  } else {

    User.findOne({emailAddress: user.name}, function (err, email) {
      if (err) return next(err);
      if (email) {
        if (bcrypt.compareSync(user.pass, email.password)) {
          req.user = email;
          return next();
        } else {
          return unauthorised(res);
        }
      } else {
        // If user isn't in database
        return unauthorised(res);
      }
    });

  }
};

module.exports = auth;
