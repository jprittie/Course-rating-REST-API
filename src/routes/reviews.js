'use strict';

var express = require('express');
var router = express.Router();
var Course = require('../models/courses');
var Review = require('../models/reviews');
var auth = require('../auth.js');


// POST /api/courses/:courseId/reviews 201
// Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', auth, function (req, res, next) {

  // Create new review with req.body
  var review = new Review(req.body);
  // Gets user from auth module
  review.user = req.user;

  // Do I need to do sub-population here as well?
  Course.findById(req.params.courseId)
    .populate('user')
    .populate({
      path: 'reviews',
      model: 'Review',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    .exec(function(err, course) {
      if (err) return next(err);

      course.reviews.push(review);
      // Then save the course
      course.save(function (err) {
      // If error pass to error handler
        if (err) return next(err);
      });
      // Then save the review
      review.save(function (err) {
        if (err) {
          // Check for validation errors
          if (err.name === 'ValidationError') {
            return res.status(400).json({
              message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.rating.message } ] }
            });
          } else {
            // Send error to error handler
            return next(err);
          }
        }
        // Send 201 status
        return res.sendStatus(201);
        // Sets location header
        res.location('/courses/' + course._id);

      });

    });
});




// DELETE /api/courses/:courseId/reviews/:id 204
// Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', auth, function (req, res, next) {
  // Remove the review with
  Review.remove({_id: req.params.id}, function (err) {
    // If error send to error handler
    if (err) return next(err);
  });

  // Is it necessary to delete review from both Review and Course model?
  // Perhaps because of timing - i.e., if I didn't use splice, I would have to put the following in the Review.remove callback for it to work
  Course.findById(req.params.courseId)
    .populate('user')
    .populate({
      path: 'reviews',
      model: 'Review',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    .exec(function(err, course) {
      if (err) return next(err);

      // Splice out the deleted review from course.reviews array
      course.reviews.splice(course.reviews.indexOf(req.params.id), 1);
      // Save the course
      course.save(function (err) {
        // If error send to error handler
        if (err) return next(err);
      });
    });

  // Send 204 status
  return res.sendStatus(204);
});



module.exports = router;
