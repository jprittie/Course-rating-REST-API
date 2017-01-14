'use strict';

var User = require('./models/users');
var basicAuth = require('basic-auth');
var bcrypt = require('bcrypt');



var auth = function (req, res, next){


  // parse the Authorization header credentials
  var user = basicAuth(req);

  // try this without function - might be clearer how errors are handled
  // could also send validation message for user
  function unauthorised (res) {
    return res.sendStatus(401);
  }

  // if the user, user.name or user.pass don't exist
  if (!user || !user.name || !user.pass) {
    // return unauthorised
    return unauthorised(res);
  } else {

    // maybe would be clearer if you called email parameter "result"
    User.findOne({emailAddress: user.name}, function (err, email) {
      if (err) return next(err);
      if (email) {
        if (bcrypt.compareSync(user.pass, email.hashedPassword)) {
          req.user = email;
          return next();
        } else {
          return unauthorised(res);
        }
      } else {
        // if user isn't in database
        return unauthorised(res);
      }
    });

  }
};

module.exports = auth;
