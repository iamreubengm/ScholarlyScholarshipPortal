"use strict";

var mongo = require("mongodb");

var getData = function(request, response) {
  if (!request.session.user) {
    return response.redirect("/");
  }

  var DB = request.app.locals.DB;

  var data = {};
  var studentId;

  if (request.query.studentId) {
    // This is a public profile request.
    // Get the student id here and do the rendering.
    studentId = request.query.studentId;
  } else {
    // This is a logged in user's request.
    // Get his/her data and do the rendering.
    studentId = request.session.user._id;
  }

  DB.collection("students").findOne(
    { _id: mongo.ObjectID(studentId) },
    function(error, student) {
      if (error) {
        return response.send("error fetching user data");
      }
      data.student = student;
      return response.render("studentProfile.hbs", data);
    }
  );
};

exports.getData = getData;
