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
  });

});


// GET /api/course/:id 200
// Returns all Course properties and related documents for the provided course ID
router.get('/courses/:id', function (req, res, next) {

  Course.findById(req.params.id)
    // can I combine these parameters in one populate function?
    // load related reviews and user documents with Mongoose population
    .populate('reviews')
    // do I need id here? and why?
    .populate('user', 'id')
    // run query against database
    .exec(function(err, course){
      // console.log(course);
      // if error, send to error handler
      if (err) return next(err);
      // format data for use in client-side app
      // var selectedCourse = {};
      // // but why do I need an array here and not in the route above?
      // selectedCourse.data = [];
      // selectedCourse.data.push(course);
      // // // send response
      // // // mason has a line here about virtuals
      // // res.json({
      // //   data: [results.toJSON({ virtuals: true })]
      // // });
      // console.log(User.overallRating);
      // res.json(selectedCourse.toJSON({ virtuals: true }) );
      res.json({
        data: [course.toJSON({ virtuals: true })]
      });

  }); // ends findById
}); // ends route

// POST /api/courses 201
// Creates a course, sets the location header, and returns no content
router.post('/courses', auth, function (req, res, next) {
  var course = new Course(req.body);
  // but make sure user cannot review their own course

  // set the step numbers to be equal to their index in the course plus one
  for (var i=0; i<course.steps.length; i++){
    course.steps[i].stepNumber = i + 1;
  }

  // save new course
  course.save(function (err) {
    // must do a lot more with validation here
    if (err) {
      // must check if it is a validation error, and if not, send it to the error handler
      console.log(err)
      next(err);
    }

    res.sendStatus(201);
    res.location('/courses/');
    // Do I need res.end?
    // res.end();
  });
});

// PUT /api/courses/:id 204
// Updates a course and returns no content
router.put('/courses/:id', auth, function (req, res, next) {
  // set the step numbers to be equal to their index in the course plus one
  for (var i=0; i<course.steps.length; i++){
    course.steps[i].stepNumber = i + 1;
  }
  // but, user should only be able to edit a course they created
  // also, Patrick and Chris used req.course.update and runValidators: true
  Course.findOneAndUpdate({_id: req.params.id}, req.body, function(err, results) {
    if (err) {
      // must check if it is a validation error, and if not, send it to the error handler
      console.log(err)
      next(err);
    }

    res.sendStatus(201);
    res.location('/courses/');

  });

});

module.exports = router;
