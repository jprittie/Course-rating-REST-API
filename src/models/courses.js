'use strict';
var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  // _id (ObjectId, auto-generated)
  // user (_id from the users collection)

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
    type: mongoose.Schema.Types.ObjectId
  }]


})


var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
