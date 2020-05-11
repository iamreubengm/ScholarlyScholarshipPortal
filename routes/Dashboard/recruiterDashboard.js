"use strict";
var mongo = require("mongodb");

var getData = function(request, response) {
  var data = {};
  var DB = request.app.locals.DB;

  if (!request.session.user) {
    //Checking Illegal access of page
    return response.redirect("/recruiterLogin");
  } else {
    DB.collection("recruiters").findOne(
      {
        userName: request.session.user.userName
      },
      function(error, loginCheck) {
        if (error) {
          return response.send("Error");
        }

        if (!loginCheck) {
          request.session.user.userName = "FORCELOGOUT"; //To prevent user from accessing previous page after changing url
          return response.redirect("/recruiterLogin");
        } else {
          data.loggedInUser = request.session.user;
        }
      }
    );
  }

  DB.collection("recruiters").findOne({
    userName: request.session.user.userName
  }),
    function(error, loginCheck) {
      if (error) {
        return response.send("Error");
      }

      if (!loginCheck) {
        response.redirect("/recruiterLogin");
      }
    };

  DB.collection("recruiterPostSch")
    .find({ recruiterId: request.session.user._id })
    .toArray(function(error, allPosts) {
      if (error) {
        return response.send("error fetching data");
      }

      data.allPosts = allPosts;

      DB.collection("studentApply")
        .find({ recruiterId: request.session.user._id })
        .toArray(function(error, students) {
          if (error) {
            return response.send("error fetching data");
          }

          data.students = students;

          console.log(students);
          return response.render("recruiterDash.hbs", data);
        });
    });
};

exports.getData = getData;
