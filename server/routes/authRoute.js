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
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const username = req.body.username.trim();

  User.findOne({
    username: username
  }).then(user => {
    if (user === null) {
      const error = inputValidation(email, password);
      if (error.length > 0) {
        res
          .status(400)
          .send(`There were errors in the form submitted:- ${error}`);
      } else {
        let userID = "user-" + uuid();
        let user = new User({
          username: username,
          email: email,
          password: password,
          userID: userID
        });
        user
          .save()
          .then(user => {
            req.session.user = user;
            req.session.accType = "verified";
            res.redirect("/user");
          })
          .catch(error => {
            res.status(500).send(error + "   Error with Registering");
          });
      }
    } else {
      res.status(400).send("Username is in use already.");
    }
  });
});

//login endpoint
router.post("/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const error = inputValidation(email, password);
  if (error.length > 0) {
    res.status(400).send(`There were errors in the form submitted:- ${error}`);
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user === null) {
        res.status(400).send("User not found");
      } else {
        bcrypt.compare(password, user.password, (err, resolve) => {
          if (resolve) {
            req.session.user = user;
            req.session.accType = "verified";
            res.redirect("/user");
          } else {
            res.status(400).send("Wrong Password!");
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

/*
if (!user) {
  //If no user is found then error message is sent
  //This will be changed later on along with some UI improvements(message modals)
  res.status(400).send("User not found"); //Need to do something about this error
} else {
  Line 127 to 140
}
*/

// .catch(err => {
//   res.status(400).send("User not found");
// });
