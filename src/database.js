'use strict';

// Require modules
var mongoose = require('mongoose');

// Connect to mongoose
// mongoose.connect('mongodb://localhost/BuildARESTAPI');
// mongoose.connect('mongodb://localhost/treehouse_courses');
// mongoose.connect('mongodb://localhost:27017/courseRatingDatabase');
mongoose.connect('mongodb://localhost/CourseRatingRESTAPI');
// Store connection in db variable
var db = mongoose.connection;
// Write message to console if there's a connection error
db.on('error', function (err) {
  console.error('Connection error: ' + err);
});

// Write message to console once connection is successful
db.once('open', function() {
  // we're connected!
  require('./seed');
  console.log("Connection successfully opened!");

  // need db.close()?
});
