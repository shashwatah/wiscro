//Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const ObjectID = require('mongodb').ObjectID;

//Creating router
const router = express.Router();

//Database connection and models
const { mongoose } = require('./../db/mongoose.js');
const { User } = require('./../models/user.js');
const { Question } = require('./../models/question.js');

//Middlewares
const { sessionChecker } = require('./../middleware/sessionChecker.js');

//submitques endpoint 
router.post('/submitques', (req, res) => {
	//Checking if the session variable user and cookie exist
	if(req.session.user && req.cookies.user_sid) {
		//If true
		//Creating question id using uuid module
		let questionID = 'question-'+uuid();
		//Creating question
		let question = new Question({
			creator: {
				ID: req.session.user.userID,
				username: req.session.user.username,
				email: req.session.user.email
			},
			questionID: questionID,
			questionText: req.body.question,
			status: 'active',
			timeCreated: new Date().getTime()
		});
		//Saving question
		question.save().then((question) => {
			res.send(`Question Submitted. Time: ${question.timeCreated}`);
		}).catch((err) => {
			res.send('Error: ' + err);
		});
	} else {
		//If the variable and cookie don't exist
		res.status(400).send('Forbidden');
	}
});	

router.post('/submitans', (req, res) => {
	if(req.session.user && req.cookies.user_sid) {
		qID = req.body.questionID;
		answer = req.body.answer;

		if(answer === "YES") {
			Question.findOne({
				questionID: qID
			}).then((ques) => {
				ques.totalNumAns += 1;
				ques.numYes += 1;
				ques.perYes = (ques.numYes/ques.totalNumAns) * 100;
				ques.perNo = (ques.numNo/ques.totalNumAns) * 100;

				ques.save();
			});
		} else if(answer === "No") {
			Question.findOne({
				questionID: qID
			}).then((ques) => {
				ques.totalNumAns += 1;
				ques.numNo += 1;
				ques.perYes = (ques.numYes/ques.totalNumAns) * 100;
				ques.perNo = (ques.numNo/ques.totalNumAns) * 100;

				ques.save();
			})
		} else {
			res.status(400).send("Wrong answer");
		}

		User.fineOne({
			_id: req.session.user._id
		}).then((user) => {
			user.answers.push({
				questionID: qID,
				answer: answer
			});
			user.save();
		});
	}else {
		res.status(400).send('Unauthorized');
	}
});

//Exporting router variable
module.exports = {
	router
}