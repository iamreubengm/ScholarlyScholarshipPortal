"use strict";

var mongo = require("mongodb");

var getData = function(request, response) {
  //Checking Illegal access of page
  var DB = request.app.locals.DB;
  if (!request.session.user) {
    return response.redirect("/");
  } else {
    DB.collection("students").findOne(
      {
        userName: request.session.user.userName
      },
      function(error, loginCheck) {
        if (error) {
          response.send("Error");
        }

        if (!loginCheck) {
          request.session.user.userName = "FORCELOGOUT"; //To prevent user from accessing previous page after changing url
          response.redirect("/");
        }
      }
    );
  }

  var schId = request.params.schId;

  DB.collection("recruiterPostSch").findOne(
    { _id: mongo.ObjectId(schId) },
    function(error, schPost) {
      if (error) {
        return response.send("error fetching Scholarship from the DB");
      }

      var data = {
        schPost: schPost
      };

      return response.render("student-apply.hbs", data);
    }
  );
};

// Applying
var postData = function(request, response) {
  var data = {};

  if (!request.session.user) {
    return response.redirect("/");
  } else {
    data.loggedInUser = request.session.user;
  }

  var DB = request.app.locals.DB;

  var schId = request.params.schId;
  var eid = request.session.user.userName;

  DB.collection("recruiterPostSch").findOne(
    { _id: mongo.ObjectID(schId) },
    function(error, schPost) {
      if (error) {
        return response.send("Error finding Scholarship");
      }

      DB.collection("studentApply").findOne(
        {
          schId: schId,
          email: eid
        },
        function(error, applied) {
          if (error) {
            return response.send("Error finding Scholarship");
          }

          if (!applied) {
            DB.collection("studentApply").insertOne(
              {
                schId: schId,
                studentId: request.session.user._id,
                recruiterId: schPost.recruiterId,

                // Insert some extra data for showing to the user
                name: request.session.user.name,
                email: request.session.user.userName,
                schTitle: schPost.schTitle,

                timeOfApply: new Date()
              },
              function(error) {
                if (error) {
                  return response.send("error occurred while applying");
                }
              }
            );
            response.redirect("/studentDash");
          } else {
            console.log("Already Applied");
            response.redirect("/studentDash");
          }
        }
      );
    }
  );
};

exports.getData = getData;
exports.postData = postData;
