'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');

var UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  emailAddress: {
    type: String,
    unique: true,
    required: [true, 'Email address is required']
  },
  hashedPassword: {
    type: String
    // throws error when I use required - why?
    // required: true
  }

});

var saltRounds = 10;
UserSchema.methods.setPassword = function (password) {
  // Update the User model to store the user's password as a salted & hashed value.
  var salt = bcrypt.genSaltSync(saltRounds);
  this.hashedPassword = bcrypt.hashSync(password, salt);
};

// Validate email
UserSchema.path('emailAddress').validate(function (v) {
  return validator.isEmail(v);
}, 'Please provide a valid email address.');

// Ensure email is unique
// Model already does this, but we should provide a custom validation error so the user knows what's wrong
// UserSchema.path('emailAddress').validate(function (value, done) {
//   this.model('User').count({ emailAddress: value }, function (err, count) {
//     if (err) {
//       return done(err);
//     }
//     // If count is greater than zero invalidate the request
//     done(!count);
//   });
// }, 'This email address is already being used by another user.');


var User = mongoose.model('User', UserSchema);
module.exports = User;
