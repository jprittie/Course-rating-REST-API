'use strict';
var mongoose = require('mongoose');
// not sure I need the following two lines
var User = require('./users');
var Review = require('./reviews');

var CourseSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  // * add required properties

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please enter a course title']
  },
  description: {
    type: String,
    required: [true, 'Please enter a course description']
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
    stepNumber: Number,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  // reviews (Array of ObjectId values, _id values from the reviews collection)
  reviews : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]

});

CourseSchema.virtual('overallRating').get(function(){
  var ratingTotal = 0;
  for (var i=0; i<this.reviews.length; i++){
    ratingTotal += this.reviews[i].rating;
  }
  var averageRating = Math.round(ratingTotal/this.reviews.length);

  return averageRating;
});


var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
