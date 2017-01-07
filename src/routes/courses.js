'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var User = require('../models/users');
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


// GET /api/course/:id 200
// Returns all Course properties and related documents for the provided course ID



// POST /api/courses 201
// Creates a course, sets the Location header, and returns no content


// PUT /api/courses/:id 204
// Updates a course and returns no content

module.exports = router;
