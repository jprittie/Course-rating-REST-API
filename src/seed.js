'use strict';

// Require mongoose-seeder
var seeder = require('mongoose-seeder');

// Require seed data
var data = require('./data/data.json');

// Seed the data
seeder.seed(data).then(function(dbData) {
  // The database objects are stored in dbData
  console.log('Success!: ' + dbData);
}).catch(function(err) {
  // handle error
  if (err) console.log(err);
});
