'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var User = require('../models/users');
var Review = require('../models/reviews');
var auth = require('../auth.js');


// * need to write universal middleware here for searches by ID?

// GET /api/courses 200
router.get('/courses', function (req, res, next) {
  // Returns the Course "_id" and "title" properties
  Course.find({}, '_id title', function (err, courses) {
    // if error, send to error handler
    if (err) return next(err);
    // format data for use in client-side app
    var allCourses = {};
    allCourses.data = courses;
    // send response
    res.json(allCourses);
    // Do I need res.end?
    // res.end();
  });

});


// GET /api/course/:id 200
// Returns all course properties and related documents for the provided course ID
router.get('/courses/:id', function (req, res, next) {

  Course.findById(req.params.id)
    // Load related reviews and user documents with Mongoose population
    .populate('reviews')
    .populate('user')
    // Run query against database
    .exec(function(err, course){
      // If error, send to error handler
      if (err) return next(err);

      // Send response
      res.json({
        data: [course.toJSON({ virtuals: true })]
      });

  }); // Ends execute query
}); // Ends route


// POST /api/courses 201
// Creates a course, sets the location header, and returns no content
router.post('/courses', auth, function (req, res, next) {
  var course = new Course(req.body);

  // Set the step numbers to be equal to their index in the course plus one
  for (var i=0; i<course.steps.length; i++){
    course.steps[i].stepNumber = i + 1;
  }

  // Save new course
  course.save(function (err) {
    // If there's a validation error, format custom error for Angular app
    if (err) {
      if (err.name === 'ValidationError') {
        var errorArray = [];

        if (err.errors.title) {
          errorArray.push({ code: 400, message: err.errors.title.message });
        }

        if (err.errors.description) {
          errorArray.push({ code: 400, message: err.errors.description.message });
        }

        // if (err.errors.steps) {
        //   errorArray.push({ code: 400, message: err.errors.steps.message });
        // }

        if (err.errors['steps.0.title']) {
          errorArray.push({ code: 400, message: err.errors['steps.0.title'].message });
        }

        if (err.errors['steps.0.description']) {
          errorArray.push({ code: 400, message: err.errors['steps.0.description'].message });
        }

        var errorMessages = { message: 'Validation Failed', errors: { property: errorArray } };
        return res.status(400).json(errorMessages);

      } else {
        // If error is not a validation error, send to middleware error handler
        return next(err);
      }
    } // Ends if (err)

    return res.sendStatus(201);
    res.location('/courses/');
  });
});

// PUT /api/courses/:id 204
// Updates a course and returns no content
router.put('/courses/:id', auth, function (req, res, next) {
  // Set the step numbers to be equal to their index in the course plus one
  for (var i=0; i<course.steps.length; i++){
    course.steps[i].stepNumber = i + 1;
  }

  // Need req.course.update and runValidators: true?
  Course.findOneAndUpdate({_id: req.params.id}, req.body, function(err, results) {
    // If there's a validation error, format custom error for Angular app
    // But this is duplicated... put in reusable function
    if (err) {
      if (err.name === 'ValidationError') {
        var errorArray = [];

        if (err.errors.title) {
          errorArray.push({ code: 400, message: err.errors.title.message });
        }

        if (err.errors.description) {
          errorArray.push({ code: 400, message: err.errors.description.message });
        }

        // if (err.errors.steps) {
        //   errorArray.push({ code: 400, message: err.errors.steps.message });
        // }

        if (err.errors['steps.0.title']) {
          errorArray.push({ code: 400, message: err.errors['steps.0.title'].message });
        }

        if (err.errors['steps.0.description']) {
          errorArray.push({ code: 400, message: err.errors['steps.0.description'].message });
        }

        var errorMessages = { message: 'Validation Failed', errors: { property: errorArray } };
        return res.status(400).json(errorMessages);

      } else {
        // If error is not a validation error, send to middleware error handler
        return next(err);
      }
    } // Ends if (err)

    return res.sendStatus(201);
    res.location('/courses/');

  });

});

// Set your headers before res.json, res.send, res.end, etc. Also make sure to return if you are sending from an if statement.

module.exports = router;
