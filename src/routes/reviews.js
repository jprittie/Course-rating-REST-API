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
  review.user = req.user;

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
      if (err) return next (err);

      // // Don't allow the course owner to post a review on their own course
      if (req.user._id.toJSON() === course.user._id.toJSON()) {
        err = new Error("Sorry, you can't review your own courses.");
        err.status = 401;
        return next(err);
      }

      // Don't allow more than one review per user
      for (var i=0; i<course.reviews.length; i++) {
        if (course.reviews[i].user._id.toJSON() === req.user._id.toJSON()) {
          err = new Error("Sorry, you can only add one review per course.");
          err.status = 401;
          return next(err);
        }
      }



      course.reviews.push(review);
      // Then save the course
      course.save(function (err) {
        if (err) return next(err);
      });

      // Then save the review
      review.save(function(err) {
        if (err) {
          // Check for validation errors
          if (err.name === 'ValidationError') {
            return res.status(400).json({
              message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.rating.message } ] }
            });
          } else {
            // Send error to middleware error handler
            return next(err);
          }
        }
        // Set 201 status
        res.status(201);
        // Sets location header
        res.location('/courses/' + req.params.courseId);
        res.end();
      });

    });
});


// DELETE /api/courses/:courseId/reviews/:id 204
// Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', auth, function (req, res, next) {

  Review.findById(req.params.id)
    .populate('user')
    .exec(function (err, review) {
    // If error send to middleware error handler
    if (err) return next(err);

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

        // Get current user, course owner and review owner
        var currentUser = req.user._id.toJSON();
        var courseOwner = course.user._id.toJSON();
        var reviewOwner = review.user._id.toJSON();

        // Only the review's user or course owner can delete a review
        if (currentUser === courseOwner || currentUser === reviewOwner) {

          // Remove the review.
          Review.findById(req.params.id)
            .remove()
            .exec(function(err) {
              if (err) return next(err);
            });

          return res.sendStatus(204);

        } else {
          var err = new Error('Sorry, only the review creator or course creator can delete a review.');
          err.status = 401;
          return next(err);
        }

      }); // Ends exec query

  });

});

module.exports = router;
