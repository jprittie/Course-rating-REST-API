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
    // required: true
  }

});

var saltRounds = 10;
UserSchema.methods.setPassword = function (password) {
  // Update the User model to store the user's password as a hashed value.
  var salt = bcrypt.genSaltSync(saltRounds);
  this.hashedPassword = bcrypt.hashSync(password, salt);
};

// I haven't salted password, but is that in requirements?
// hash password before saving to database
// UserSchema.pre('save', function(next){
//   var user = this;
//   bcrypt.hash(user.password, 10, function(err, hash){
//     if (err) return next(err);
//     user.hashedPassword = hash;
//     console.log(user.hashedPassword);
//     next();
//   });
// });

var User = mongoose.model('User', UserSchema);
module.exports = User;
