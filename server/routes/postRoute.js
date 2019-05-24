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
    //Creating a secondary ID for the question using the uuid module
    let questionID = "question-" + uuid();
    //Creating the question object based in teh Question schema
    let question = new Question({
      creator: {
        ID: req.session.user.userID,
        username: req.session.user.username,
        email: req.session.user.email
      },
      questionID: questionID,
      questionText: req.body.question,
      active: true,
      timeCreated: new Date().getTime()
    });
    //Saving question
    question
      .save()
      .then(question => {
        //Finding the user that submitted the answer based on the '_id' of the session variable 'user'
        User.findOne({
          username: req.session.user.username,
          email: req.session.user.email
        }).then(user => {
          //Adding the question to the list of questions of the user
          user.questions.push({
            questionID: question.questionID
          });
          user.save();
        });
        res.status(200).send("Question Submitted!");
      })
      .catch(err => {
        res.status(400).send("Your Question could not be submitted.");
      });
  } else {
    //If the variable and cookie don't exist
    res.status(400).send("Forbidden. Unauthorized access to /submitques.");
  }
});

router.post("/submitans", (req, res) => {
  //Checking if the session variable user and cookie exist
  if (req.session.user && req.cookies.user_sid) {
    questionID = req.body.questionID;
    answer = req.body.answer;
    //Finding the question with the questionID as the parameter
    Question.findOne({
      questionID: questionID
    }).then(question => {
      //Updating the values in the question document
      //update() can be used instead of the method below but it has some limitations
      if (answer === "YES") {
        question.numYes += 1;
      } else if (answer === "NO") {
        question.numNo += 1;
      }
      question.totalNumAns += 1;
      question.perYes = Math.round(
        (question.numYes / question.totalNumAns) * 100
      );
      question.perNo = Math.round(
        (question.numNo / question.totalNumAns) * 100
      );

      question.save().then(questionSaved => {
        //Finding the user that submitted the answer based on the '_id' of the session variable 'user'
        User.findOne({
          _id: req.session.user._id
        }).then(user => {
          //Adding the question to the list of answers of the user
          user.answers.push({
            questionID: questionSaved.questionID,
            answer: answer
          });
          user.save();
        });
        res.status(200).send(`Answer Submitted, Your Answer = ${answer}`);
      });
    });
  } else {
    res.status(400).send("Forbidden. Unauthorized access to /submitans");
  }
});

//Exporting router variable
module.exports = {
  router
};
