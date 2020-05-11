"use strict";

var getData = function(request, response) {
  return response.render("student-signup.hbs");
};

var postData = function(request, response) {
  var DB = request.app.locals.DB;

  var confirmPassword = request.body.confirmPassword;
  var userDetails;
  var user = {
    name: request.body.name,
    edu: request.body.edu,
    skills: request.body.skills,
    ach: request.body.ach,
    userName: request.body.userName,
    password: request.body.password
  };

  userDetails = {
    userName: request.body.userName
  };

  if (user.password == confirmPassword) {
    DB.collection("students").findOne(userDetails, function(
      //Checking if email in use
      error,
      recruiter
    ) {
      if (error) {
        return response.send("DB error occurred");
      }

      if (!recruiter) {
        DB.collection("students").insertOne(user, function(error) {
          if (error) {
            response.send("Error occured while signing up");
          } else {
            request.session.user = null;
            response.redirect("/");
          }
        });
      } else {
        console.log("Email Exists");
        response.redirect("/signupStudent");
      }
    });
  } else {
    response.redirect("/signupStudent");
  }
};

exports.getData = getData;
exports.postData = postData;
