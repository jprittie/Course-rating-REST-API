'use strict';

var UserSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  fullName: String,
  emailAddress: String,
  hashedPassword: String
    
})
