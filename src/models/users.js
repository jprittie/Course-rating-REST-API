'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required']
  },
  hashedPassword: {
    type: String,
    required: true
  }

});


var User = mongoose.model('User', UserSchema);
module.exports = User;
