//Importing modules
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const bcrypt = require("bcryptjs");

//Creatin the router
const router = express.Router();

//Database connection and models
const { mongoose } = require("./../db/mongoose.js");
const { User } = require("./../models/user.js");

//Middlewares
const { sessionChecker } = require("./../middleware/sessionChecker.js");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());

//Function to validate email using regex
//Same as the front end
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//Function to validate input on the server side
function inputValidation(email, pass) {
  let error = "";

  if (!email || !pass) {
    error += "No email or password entered.\t";
  }
  if (!validateEmail(email)) {
    error += "Email input wrong.\t";
  }
  if (pass.length < 8) {
    error += "Password length less than 8.";
  }

  return error;
}

//register endpoint
router.post("/register", sessionChecker, (req, res) => {
  //Trimming the input
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const username = req.body.username.trim();

  //No need to validate the username as of now
  //Looking for the username in the database
  User.findOne({
    username: username
  })
    .then(user => {
      //If a user is found then the username is already being used but if the user object is null then the username is not being used
      if (user === null) {
        throw new Error("User object is null");
      } else console.log(user);
    })
    .catch(err => {
      //If an error is thrown then username is not being used
      //Continue the registration process

      //Validating the email and password input now
      const error = inputValidation(email, password);
      //The length of error variable will be more than 0 if there are problems with the input
      if (error.length > 0) {
        //Error message will be sent
        //This will be changed later on along with some UI improvements(message modals)
        res
          .status(400)
          .send(`There were errors in the form submitted:- ${error}`);
      } else {
        //If there's no error
        //Creating a userID with the uuid module
        let userID = "user-" + uuid();
        //Creating the user
        let user = new User({
          username: username,
          email: email,
          password: password,
          userID: userID
        });
        //Saving to the database
        user
          .save()
          .then(user => {
            req.session.user = user;
            req.session.accType = "verified";
            res.redirect("/user");
          })
          .catch(error => {
            //Error message is sent if there is an error thrown
            res.status(200).send(error + "   Error with Registering"); //Need to do something about this error
          });
      }
    });
});

//login endpoint
router.post("/login", (req, res) => {
  //Trimming the input
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  //Validating the input
  const error = inputValidation(email, password);
  //The length of error variable will be more than 0 if there are problems with the input
  if (error.length > 0) {
    //Error message will be sent
    //This will be changed later on along with some UI improvements(message modals)
    res.status(400).send(`There were errors in the form submitted:- ${error}`);
  } else {
    //If there's no error
    //Finding the user based on the email input
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        //If no user is found then error message is sent
        //This will be changed later on along with some UI improvements(message modals)
        res.status(400).send("User not found"); //Need to do something about this error
      } else {
        //If the user is found
        //Comparing the password with the hashed password using the bcrypt module
        bcrypt.compare(password, user.password, (err, resolve) => {
          if (resolve) {
            //If the password match is successful
            //Creating session variables user and acctype
            req.session.user = user;
            req.session.accType = "verified";
            //Redirecting to /user endpoint with the session variables
            res.redirect("/user");
          } else {
            //If password does not match then error message is sent
            //This will be changes later on along with some UI improvements(message modals)
            res.send("Wrong Password!"); //Need to do something about this error
          }
        });
      }
    });
  }
});

//logout endpoint
router.get("/logout", (req, res) => {
  /*If the session variable user and cookie exist and this endpoint is hit then the session and
	cookie are deleted and the user is logged out*/
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    //Redirecting the user to main page
    res.redirect("/");
  } else {
    //If the session variable user and cookie don't exist
    //Send an error
    //This will be changed later on along with some UI improvements(message modals)
    res.send("Error with logout"); //Need to do something about this error
  }
});

//Exporting router variable
module.exports = {
  router
};
