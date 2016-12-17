'use strict';

var ReviewSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  // user (_id from the users collection)

  postedOn: Date,
  rating: Number,
  review: String
    
})
