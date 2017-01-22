'use strict';
var mongoose = require('mongoose');

// Must add further validation messages?

var CourseSchema = new mongoose.Schema({
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
      required: [true, 'Please enter a step title']
    },
    description: {
      type: String,
      required: [true, 'Please enter a step description']
    }
  }],
  reviews : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]

});

// Ensure course contains at least one step
CourseSchema.path('steps').validate(function (steps) {
  if (!steps) {
    return false;
  } else if (steps.length === 0) {
    return false;
  }
  return true;
}, 'Course must have at least one step');


// Update the Course schema with an overallRating virtual property.
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
