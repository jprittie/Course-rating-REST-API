'use strict';
var mongoose = require('mongoose');


var ReviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: [true, 'Please enter a rating'],
    min: 1,
    max: 5,
    default: 0
  },
  review: String

});

// Round rating that user entered to nearest whole number
ReviewSchema.pre('save', function(next) {
  Math.round(this.rating);
  next();
});

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
