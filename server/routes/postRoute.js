//Importing modules
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const ObjectID = require("mongodb").ObjectID;

//Creating router
const router = express.Router();

//Database connection and models
const { mongoose } = require("./../db/mongoose.js");
const { User } = require("./../models/user.js");
const { Question } = require("./../models/question.js");

//Middlewares
const { sessionChecker } = require("./../middleware/sessionChecker.js");

//submitques endpoint
router.post("/submitques", (req, res) => {
  //Checking if the session variable user and cookie exist
  if (req.session.user && req.cookies.user_sid) {
    //If true
    //Creating question id using uuid module
    let questionID = "question-" + uuid();
    //Creating question
    let question = new Question({
      creator: {
        ID: req.session.user.userID,
        username: req.session.user.username,
        email: req.session.user.email
      },
      questionID: questionID,
      questionText: req.body.question,
      status: "active",
      timeCreated: new Date().getTime()
    });
    //Saving question
    question
      .save()
      .then(question => {
        res.send(`Question Submitted. Time: ${question.timeCreated}`);
      })
      .catch(err => {
        res.send("Error with submitting questions" + err);
      });
  } else {
    //If the variable and cookie don't exist
    res.status(400).send("Forbidden. Unauthorized access to /submitques.");
  }
});

router.post("/submitans", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    qID = req.body.questionID;
    answer = req.body.answer;

    Question.findOne({
      questionID: qID
    }).then(ques => {
      if (answer === "YES") {
        ques.numYes += 1;
      } else if (answer === "NO") {
        ques.numNo += 1;
      }
      ques.totalNumAns += 1;
      ques.perYes = Math.round((ques.numYes / ques.totalNumAns) * 100);
      ques.perNo = Math.round((ques.numNo / ques.totalNumAns) * 100);

      ques.save();

      User.findOne({
        _id: req.session.user._id
      }).then(user => {
        user.answers.push({
          questionID: qID,
          answer: answer
        });
        user.save();
      });

      res.status(200).send(`Answer Submitted, Your Answer = ${answer}`);
    });
  } else {
    res.status(400).send("Forbidden. Unauthorized access to /submitans");
  }
});

//Exporting router variable
module.exports = {
  router
};
