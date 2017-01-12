var express = require('express');
var router = express.Router();
var User = require('../models/users');


// GET /api/users 200
// Returns the currently authenticated user


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
  var userData = new User();
  // set form input as properties
  userData.fullName = req.body.fullName;
  userData.emailAddress = req.body.emailAddress;
  userData.password = req.body.password;
  // userData.confirmPassword = req.body.confirmPassword;

  // everyone used user.save here instead of user.create - why?
  // also, Dave capped User
  User.create(userData, function(error, user){
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.status(201);
      return res.redirect('/');
    }


  });


  // user.save(function(err) {
  //   if (err) {
  //     console.log(err)
  //     // this is where validation gets tricky - one e.g. put validation in another file
  //   }
  //   res.status(201);
  //   res.location('/');
  //   res.end();
  // });

});


module.exports = router;
