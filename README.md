## Course Rating REST API
### Built with Node, Express, MongoDB, Mongoose, bcrypt, basic-auth
*Project 11 of Treehouse Full Stack JavaScript course*

### To run this project:
Run `git clone https://github.com/jprittie/Course-rating-REST-API.git`. Run `npm install` to install the dependencies. To run a mongodb instance, open a second terminal tab and run `mongod`. In the first terminal tab, run `npm start` and navigate to localhost:5000. Then you can sign up for the app, add courses and review courses. 

### Project objectives:
In this project, students create a REST API using Express. The API will provide a way for users to review educational courses: users can see a list of courses in a database; add courses to the database; and add reviews for a specific course.

To complete this project, students use their knowledge of REST API design, Node.js, and Express to create API
routes, along with Mongoose and MongoDB for data modeling, validation, and persistence. In addition to common developer tools like Postman, students are provided with an AngularJS single page application that they can use to test and exercise your REST API. The AngularJS application includes views to display a list of courses, display the details for a course including reviews and the ability to post/delete a review, create or update a course, register a user, and login a user.

### Specific requirements:

#### The REST API must include two main resources, “courses” and “users,” containing the following routes:
* /api/courses — GET returns a list of courses, POST creates a course
* /api/courses/:id — GET returns a single course, PUT updates a course
* /api/courses/:courseId/reviews — POST creates a review for the specified course
* /api/courses/:courseId/reviews/:id — DELETE removes a review
* /api/users — POST creates a user
* /api/users/ — GET returns the current user


#### Set up error handlers:
* Add a global error handler middleware function that writes error information to the response in the
JSON format.
* Add a middleware function to catch 404 errors and forward an error to the global error handler.

#### Set up a database connection using Mongoose:
* Write a message to the console if there's an error connecting to the database.
* Write a message to the console once the connection has been successfully opened.

#### Create Mongoose schemas and models according to detailed specifications
#### Seed the database with data
#### Update the Course schema with an overallRating virtual property
#### Update the User model to store the user's password as a hashed value
#### Add validation to your Mongoose schemas, according to detailed specifications
#### Set up basic authentication:
* The AngularJS application will send an Authorization header with each request when a user is
* signed in.
* You can use the basic-auth npm package to parse the `Authorization' header into the user's
credentials.
* Add a middleware function that attempts to get the user credentials from the request.
* Update all routes that require authentication to check for the current user and return a 401 HTTP
status code if not available.
#### Add the following permissions:
* Don't allow anything other than the current user's information to be returned from the GET
/api/users route.
* Don't allow anyone other than the current user to add/edit courses.
* Don't allow anyone to delete a review other than the review's user and the course owner.
