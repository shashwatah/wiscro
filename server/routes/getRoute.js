//Importing modules
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");

//Creating router
const router = express.Router();

//Database connection and models
const { mongoose } = require("./../db/mongoose.js");
const { User } = require("./../models/user.js");
const { Question } = require("./../models/question.js");

//feedques endpoint
router.get("/feedques", (req, res) => {
  //Checking the session and cookie to make sure the person or device accessing the endpoint is authorized
  if (req.session.user && req.cookies.user_sid) {
    //Finding all the questions that are still active and are not created by the user
    //$ne helps in finding all the documents in which a certain field is not equal(ne) to the value provided
    Question.find(
      {
        active: true,
        "creator.email": {
          $ne: req.session.user.email
        }
      },
      (err, allQuestions) => {
        let userQuestionsAnswered;
        let finalQuestions;
        User.findOne({
          email: req.session.user.email
        })
          .then(async user => {
            //A list of all the questions answered by the user
            userQuestionsAnswered = user.answers;
            //Creating a final list of all the questions
            /*This list will contain all the questions that were not created by the user and have not been 
            answered by the user yet*/
            finalQuestions = await allQuestions.filter(current => {
              let flag = true;
              //every() method can't be used, check the checklist to see why.
              userQuestionsAnswered.forEach(cur => {
                if (cur.questionID === current.questionID) {
                  flag = false;
                }
              });
              return flag;
            });
            res.status(200).send(finalQuestions);
          })
          .catch(err => {
            res.status(500).send("Error feeding questions");
          });
      }
    );
  } else {
    res.status(400).send("Forbidden. Unauthorized access to /feedques");
  }
});

//myques endpoint
router.get("/myques", (req, res) => {
  //Checking if the session variable user and cookie exist
  //If they do then the user is logged in
  if (req.session.user && req.cookies.user_sid) {
    //Finding the questions with the email of the user
    Question.find(
      {
        "creator.email": req.session.user.email,
        active: false
      },
      (error, questions) => {
        if (error) {
          res.status(500).send("Could not find questions.");
        } else {
          const questionsReversed = questions.reverse();
          res.status(200).send(questionsReversed);
        }
      }
    );
  } else {
    //If not send a Forbidden message with status code 400
    res.status(400).send("Forbidden. Unauthorized access to /myques");
  }
});

//myans endpoint
router.get("/myans", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    User.findOne({
      email: req.session.user.email,
      username: req.session.user.username
    })
      .then(async user => {
        const userAnswers = user.answers;
        let answerData = new Array();
        /*
        Did not use forEach as it did not work with async/await, the response was sent a few milliseconds
        before the forEach computation finished.
        On the other hand for...of iteration worked with using await before Question.find
        */
        for (const currentAnswer of userAnswers) {
          await Question.find({
            questionID: currentAnswer.questionID
          }).then(question => {
            answerData.push({
              question: question,
              answer: currentAnswer.answer
            });
          });
        }
        let answerDataReversed = answerData.reverse();
        res.status(200).send(answerDataReversed);
      })
      .catch(err => {
        res.status(500).send("Could not find user");
      });
  } else {
    res.status(400).send("Forbidden. Unauthorized access to /myans");
  }
});

//Exporting router variable
module.exports = {
  router
};

//Refactor the code
