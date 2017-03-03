'use strict';

// Require modules
var express = require('express');
var app = express();
var logger = require('morgan');
var jsonParser = require('body-parser').json;


// Require mongoose models
require('./models/courses');
require('./models/reviews');
require('./models/users');
// Require file that opens mongoose connection and seeds database
require('./database');


// Set port to 5000
app.set('port', process.env.PORT || 5000);

// Use Morgan for HTTP request logging
app.use(logger('dev'));
// Parse JSON
app.use(jsonParser());

// Serve static files from the "public" folder
app.use('/', express.static('public'));

// Require and use routes
var routes = require('./routes');
app.use('/api', routes.course);
app.use('/api', routes.review);
app.use('/api', routes.user);


// Add a middleware function to catch 404 errors and forward an error to the global error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Add a global error handler middleware function that writes error information to the response in JSON format
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// Start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
