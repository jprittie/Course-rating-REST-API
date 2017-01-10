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
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
    { stepNumber: Number,
      title: String,
      description: String
    }
  ],
  // reviews (Array of ObjectId values, _id values from the reviews collection)
  reviews : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]


});


var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
