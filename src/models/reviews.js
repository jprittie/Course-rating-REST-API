'use strict';
var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  // user (_id from the users collection)

  postedOn: Date,
  rating: Number,
  review: String

})



var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
