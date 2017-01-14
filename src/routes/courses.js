'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var User = require('../models/users');
var Review = require('../models/reviews');
// require auth
// var auth = require('../auth.js');


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


// GET /api/course/:id 200 xxx

// Returns all Course properties and related documents for the provided course ID
// When returning a single course for the GET /api/courses/:id route, use Mongoose population to
// load the related user and reviews documents.
router.get('/courses/:id', function (req, res, next) {

  Course.findById(req.params.id)
    // can I combine these parameters in one populate function?
    // load related reviews and user documents
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
// Creates a course, sets the Location header, and returns no content


// PUT /api/courses/:id 204
// Updates a course and returns no content

module.exports = router;
