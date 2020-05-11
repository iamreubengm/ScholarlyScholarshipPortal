"use strict";

var getData = function(request, response) {
  return response.render("recruit-signup.hbs");
};

var postData = function(request, response) {
  var DB = request.app.locals.DB;

  var confirmPassword = request.body.confirmPassword;

  var user = {
    name: request.body.name,
    phone: request.body.phone,
    designation: request.body.designation,
    organization: request.body.organization,
    userName: request.body.userName,
    password: request.body.password,
    inlineRadioOptions: request.body.inlineRadioOptions
  };

  var userDetails = {
    userName: request.body.userName
  };

  if (user.password == confirmPassword) {
    DB.collection("recruiters").findOne(userDetails, function(
      //Checking if email in use
      error,
      recruiter
    ) {
      if (error) {
        return response.send("db error occurred");
      }

      if (!recruiter) {
        DB.collection("recruiters").insertOne(user, function(error) {
          if (error) {
            response.send("error occured while signup");
          } else {
            request.session.user = null;
            response.redirect("/recruiterLogin");
          }
        });
      } else {
        console.log("Email Exists");
        response.redirect("/signUp_recruiter");
      }
    });
  } else {
    response.redirect("/signUp_recruiter");
  }
};

exports.getData = getData;
exports.postData = postData;
