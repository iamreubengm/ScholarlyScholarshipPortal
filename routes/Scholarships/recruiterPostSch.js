"use strict";

var getData = function(request, response) {
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
          response.redirect("/recruiterLogin");
        } else {
          return response.render("recruiterPostSch.hbs");
        }
      }
    );
  }
};

var postData = function(request, response) {
  var DB = request.app.locals.DB;

  var schTitle = request.body.schTitle;
  var schDescription = request.body.schDescription;
  var type = request.body.type;
  var location = request.body.location;
  var desiredCandidates = request.body.desiredCandidates;
  var recruiterId = request.session.user._id;

  var data = {
    schTitle: schTitle,
    schDescription: schDescription,
    type: type,
    location: location,
    desiredCandidates: desiredCandidates,
    recruiterId: recruiterId
  };

  DB.collection("recruiterPostSch").insertOne(data, function(error, result) {
    if (error) {
      return response.send("Error occured while inserting data to DB");
    }
    return response.redirect("/recruiterDash");
  });
};

exports.getData = getData;
exports.postData = postData;
