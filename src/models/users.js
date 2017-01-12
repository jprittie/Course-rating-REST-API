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
    unique: true,
    required: [true, 'Email address is required']
  },
  hashedPassword: {
    type: String,
    required: true
  }

});

// hash password before saving to database
UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if (err) return next(err);
    user.hashedPassword = hash;
    next();
  });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
