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
        let finalQuestionsStrings = new Array();
        User.findOne({
          email: req.session.user.email
        })
          .then(user => {
            //A list of all the questions answered by the user
            userQuestionsAnswered = user.answers;
            //Creating a final list of all the questions
            /*This list will contain all the questions that were not created by the user and have not been 
            answered by the user yet*/
            finalQuestions = allQuestions.filter(current => {
              let flag = true;
              //every() method can't be used, check the checklist to see why.
              userQuestionsAnswered.forEach(cur => {
                if (cur.questionID === current.questionID) {
                  flag = false;
                }
              });
              return flag;
            });
            for (var current of finalQuestions) {
              finalQuestionsStrings.push({
                string: `<div class = "user-question" data-questionID = "${
                  current.questionID
                }"><div class = "user-question-div user-question-ans user-question-yes" data-anstype = "YES"><p>Yes</p></div><div class = "user-question-div user-question-ques"><p>${
                  current.questionText
                }</p></div><div class = "user-question-div user-question-ans user-question-no" data-anstype = "NO"><p>No</p></div></div>`
              });
            }
            res.status(200).send(finalQuestionsStrings);
          })
          .catch(err => {
            res.status(500).send("Error feeding questions");
          });
      }
    );
  } else {
    res.status(401).send("Forbidden. Unauthorized access to /feedques");
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
        const questionsReversed = questions.reverse();
        let questionStrings = new Array();
        for (var current of questionsReversed) {
          questionStrings.push({
            string: `<div class="myques">
            <div class="myques-ques">
              <p>${current.questionText}</p>
            </div>
            <div class="myques-ans">
              <div class="myques-ans-yes" style="width: ${
                current.perYes
              }%; opacity: ${current.perYes > current.perNo ? 1 : 0.3}">${
              current.perYes < 8 ? `` : `Yes: ${current.perYes}%`
            }</div>
              <div class="myques-ans-no" style="width: ${
                current.perNo
              }%; opacity: ${current.perNo > current.perYes ? 1 : 0.3}">${
              current.perNo < 8 ? `` : `No: ${current.perNo}%`
            }</div>
            </div>
          </div>`
          });
        }
        res.status(200).send(questionStrings);
      }
    );
  } else {
    //If not send a Forbidden message with status code 400
    res.status(401).send("Forbidden. Unauthorized access to /myques");
  }
});

//myans endpoint
router.get("/myans", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    User.findOne({
      email: req.session.user.email,
      username: req.session.user.username
    })
      .then(user => {
        const userAnswers = user.answers;
        let answerData = new Array();
        let answerStrings = new Array();
        /*
        Did not use forEach as it did not work with async/await, the response was sent a few milliseconds
        before the forEach computation finished.
        On the other hand for...of iteration worked with using await before Question.find
        forEach won't work properly if it has an async function inside of it
        */
        for (const currentAnswer of userAnswers) {
          Question.find({
            questionID: currentAnswer.questionID
          }).then(question => {
            answerData.push({
              question: question,
              answer: currentAnswer.answer
            });
          });
        }
        let answerDataReversed = answerData.reverse();
        for (var current of answerDataReversed) {
          const question = current.question[0];
          const answer = current.answer;
          answerStrings.push({
            string: `<div class="myans">
          <div class="myans-ques">
            <p>${question.questionText}</p>
          </div>
          <div class="myans-ans">
            <div class="myques-ans-yes"
            style="width: ${question.perYes}%; ${
              answer === "YES"
                ? `background-color: #1190CB; opacity: 1;`
                : `background-color: #111111; opacity: 0.5;`
            }">${question.perYes < 8 ? "" : `Yes: ${question.perYes}%`}</div>
            <div class="myques-ans-no"
            style="width: ${question.perNo}%; ${
              answer === "NO"
                ? `background-color: #1190CB; opacity: 1;`
                : `background-color: #111111; opacity: 0.5;`
            }">${question.perNo < 8 ? "" : `No: ${question.perNo}%`}</div>
          </div>
        </div>`
          });
        }
        res.status(200).send(answerStrings);
      })
      .catch(err => {
        res.status(500).send("Could not find user");
      });
  } else {
    res.status(401).send("Forbidden. Unauthorized access to /myans");
  }
});

//Exporting router variable
module.exports = {
  router
};
