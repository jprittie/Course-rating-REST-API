var express = require('express');
var router = express.Router();
var User = require('../models/users');
var auth = require('../auth.js');


// GET /api/users 200
// Returns the currently authenticated user
router.get('/users', auth, function (req, res, next) {
  var authorizedUser = {};
  authorizedUser.data = [];
  authorizedUser.data.push(req.user);
  res.json(authorizedUser);
});

// POST /api/users 201
// Creates a user, sets the Location header to "/", and returns no content
// The AngularJS application will send you password and confirmPassword values in the request
// body when calling the POST /api/users route
router.post('/users', function(req, res, next){
  // check that both password fields have been filled out
  if (!req.body.password || !req.body.confirmPassword) {
    // return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Please fill out all fields.' } ] }
    });
  // check that password and confirmPassword match
  } else if (req.body.password !== req.body.confirmPassword) {
    // return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Password fields do not match.' } ] }
    });
  }
  // should also do a regex check here?
  // what is the Validator model that Patrick used?

  // create new user
  var user = new User();
  // set form input as properties
  user.fullName = req.body.fullName;
  user.emailAddress = req.body.emailAddress;
  user.password = req.body.password;
  // set password by calling mongoose instance method
  user.setPassword(req.body.password);


  user.save(function(err) {
    if (err) {
      console.log(err)
      // this is where validation gets tricky - one e.g. put validation in another file
    }
    res.status(201);
    res.location('/');
    // Do I need res.end?
    res.end();
  });

});


module.exports = router;
