'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
// Require validator module here for email validation

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


var User = mongoose.model('User', UserSchema);
module.exports = User;
