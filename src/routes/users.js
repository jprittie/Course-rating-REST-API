'use strict';
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
// The AngularJS app will send password and confirmPassword values in the request body
router.post('/users', function(req, res, next){
  // Check that both password fields have been filled out
  if (!req.body.password || !req.body.confirmPassword) {
    // Return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Please fill out all fields.' } ] }
    });
  // Check whether password and confirmPassword match
  } else if (req.body.password !== req.body.confirmPassword) {
    // Return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Password fields do not match.' } ] }
    });
  }

  // Create new user
  var user = new User();
  // Set form input as properties
  user.fullName = req.body.fullName;
  user.emailAddress = req.body.emailAddress;
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  // Hash and salt password and confirmPassword by calling mongoose instance method
  user.setPassword(req.body.password, req.body.confirmPassword);


  user.save(function(err) {
    // Handle validation errors so they can be used by Angular app
    if (err) {
      if (err.name === 'ValidationError') {
        var errorArray = [];

        if (err.errors.fullName) {
          errorArray.push({ code: 400, message: err.errors.fullName.message });
        }

        if (err.errors.emailAddress) {
          errorArray.push({ code: 400, message: err.errors.emailAddress.message });
        }

        var errorMessages = { message: 'Validation Failed', errors: { property: errorArray } };
        return res.status(400).json(errorMessages);

      } else {
        // If error is not a validation error, send to middleware error handler
        return next(err);
      }
    } // Ends if (err)

  res.location('/');  
  return res.status(201).send();


  }); // Ends user.save

}); // Ends POST users route


module.exports = router;
