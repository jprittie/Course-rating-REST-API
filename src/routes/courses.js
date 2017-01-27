'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var User = require('../models/users');
var Review = require('../models/reviews');
var auth = require('../auth.js');


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
    // Load related reviews and user documents with Mongoose population and sub-population
    .populate('user')
    .populate({
      path: 'reviews',
      model: 'Review',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    // Run query against database
    .exec(function(err, course){

      // If error, send to error handler
      if (err) return next(err);

      var courseDetails = {};
			courseDetails.data = [];
			courseDetails.data.push(course.toObject({ virtuals: true }) );
			res.json(courseDetails);

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

    // // Don't allow more than one review per user.
    // for (var i = 0; i < course.reviews.length; i++) {
    //   if (course.reviews[i].user.toJSON() === req.user._id.toJSON()) {
    //     err = new Error("Sorry, you can only add one review per course.");
    //     err.status = 401;
    //     return next(err);
    //   }
    // }
    //
    // // Don't allow the course owner to post a review on their own course.
    // if (req.user._id.toJSON() === course.user._id.toJSON()) {
    //   err = new Error("Sorry, you can't review your own courses.");
    //   err.status = 401;
    //   return next(err);
    // }


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

  Course.findById(req.params.id)
    // Run query against database
    .exec(function(err, course){

      // If error, send to error handler
      if (err) return next(err);

      // Only allow course owner to update course
      var user = req.user._id.toJSON();
      var courseOwner = course.user.toJSON();
      var authorized = (user === courseOwner);

      if (!authorized) {
        var err = new Error("Sorry, you can only edit a course that you created.");
        err.status = 401;
        return next(err);
      } else {

        // why do I have req.course here? I could probably just do course.update
        req.course = course;
        // runValidators adds validation to updates
        req.course.update(req.body, {runValidators: true}, function (err, course){
        // req.course.update(req.body, function (err, course) {

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

          // Return response
          return res.sendStatus(204);

        }); // Ends course.update

      } // Ends if authorized user
    }); // Ends execute query

}); // Ends router.put

// Set your headers before res.json, res.send, res.end, etc. Also make sure to return if you are sending from an if statement.

module.exports = router;
