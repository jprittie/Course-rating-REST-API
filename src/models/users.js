'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  fullName: String,
  emailAddress: String,
  hashedPassword: String

})


var User = mongoose.model('User', UserSchema);
module.exports = User;
