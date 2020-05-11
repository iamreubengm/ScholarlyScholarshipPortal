"use strict";

var mongo = require("mongodb");

var getData = function(request, response) {
  if (!request.session.user) {
    return response.redirect("/recruiterLogin");
  }

  var DB = request.app.locals.DB;

  var data = {};
  var recruiterId;

  if (request.query.recruiterId) {
    // This is a public profile request.
    // Get the student id here and do the rendering.
    recruiterId = request.query.recruiterId;
  } else {
    // This is a logged in user's request.
    // Get his/her data and do the rendering.
    recruiterId = request.session.user._id;
  }

  DB.collection("recruiters").findOne(
    { _id: mongo.ObjectID(recruiterId) },
    function(error, recruiter) {
      if (error) {
        return response.send("error fetching user data");
      }
      data.recruiter = recruiter;
      return response.render("recruiterProfile.hbs", data);
    }
  );
};

var getFormData = function(request, response) {
  response.render("recruiterProfileForm.hbs");
};

var postData = function(request, response) {
  var DB = request.app.locals.DB;
  var recruiterId = request.session.user._id;
  var form = new multiparty.Form();
  var data;
  form.parse(request, function(error, fields, files) {
    var createdBy = request.session.user._id;

    data = {
      name: fields.name,
      mail: fields.mailId,
      designation: fields.designation,
      organization: fields.organization,
      phoneNumber: fields.phoneNumber,
      summary: fields.summary,
      inlineRadioOptions: fields.inlineRadioOptions,
      createdBy: createdBy
    };
  });
  DB.collection("recruiters").replaceOne(
    { _id: mongo.ObjectID(recruiterId) },
    data
  );
  return response.render("recruiterProfileForm.hbs");
};

exports.getData = getData;
exports.getFormData = getFormData;
exports.postData = postData;
