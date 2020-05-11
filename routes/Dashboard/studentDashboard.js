"use strict";

var mongo = require("mongodb");

var getData = function(request, response) {
  var DB = request.app.locals.DB;

  if (!request.session.user) {
    //Checking Illegal access of page
    return response.redirect("/");
  } else {
    DB.collection("students").findOne(
      {
        userName: request.session.user.userName
      },
      function(error, loginCheck) {
        if (error) {
          return response.send("Error");
        }

        if (!loginCheck) {
          request.session.user.userName = "FORCELOGOUT"; //To prevent user from accessing previous page after changing url
          response.redirect("/");
        } else {
          data.loggedInUser = request.session.user;
        }
      }
    );
  }

  var querysearch = request.query.searchSch;

  var data = {};
  var studentId;

  studentId = request.session.user._id;

  DB.collection("studentApply")
    .find({ studentId: request.session.user._id })
    .toArray(function(error, applied) {
      if (error) {
        return response.send("error fetching data");
      }

      data.applied = applied;

      console.log(applied);

      DB.collection("recruiterPostSch")
        .find({
          $or: [
            { type: { $regex: querysearch } },
            { location: { $regex: querysearch } },
            { schTitle: { $regex: querysearch } }
          ]
        })

        .toArray(function(error, sch) {
          data.sch = sch;
          response.render("studentsDashboard.hbs", data);
        });
    });
};

exports.getData = getData;
