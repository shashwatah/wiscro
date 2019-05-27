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
    error += "Fill in all the fields. ";
  } else {
    if (!validateEmail(email)) {
      error += "Invalid Email. ";
    }
    if (pass.length < 8) {
      error += "Password length less than 8 characters. ";
    }
  }

  return error;
}

//register endpoint
router.post("/register", sessionChecker, (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const username = req.body.username.trim();

  //Checking if the username is already in use by finding a user in the database using the username as the parameter
  User.findOne({
    username: username
  }).then(user => {
    if (user === null) {
      User.findOne({
        email: email
      }).then(user => {
        if (user === null) {
          const error = inputValidation(email, password);
          if (error.length > 0) {
            res.status(400).render("registerPage.hbs", {
              error: error
            });
          } else {
            //Forming a secondary ID for the user using the uuid module
            let userID = "user-" + uuid();
            //Creating the user object based on the User schema
            let user = new User({
              username: username,
              email: email,
              password: password,
              userID: userID
            });
            user
              .save()
              .then(user => {
                //Upon saving creating a session for the user and redirecting to /user endpoint
                //A registered user is given 'verified' accType and a guest is given 'anon' accType
                req.session.user = user;
                req.session.accType = "verified";
                res.status(300).redirect("/user");
              })
              .catch(err => {
                console.log(err);
                res.status(500).render("registerPage.hbs", {
                  error:
                    "We encountered an error while registering you, Please try again later."
                });
              });
          }
        } else {
          res.status(400).render("registerPage.hbs", {
            error: "The Email you entered is already registered to an account."
          });
        }
      });
    } else {
      res.status(400).render("registerPage.hbs", {
        error: "The Username you entered is in use already."
      });
    }
  });
});

//login endpoint
router.post("/login", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const error = inputValidation(email, password);
  if (error.length > 0) {
    res.status(400).render("loginPage.hbs", {
      error: error
    });
  } else {
    //Finding the user with email as the parameter
    User.findOne({
      email: email
    }).then(user => {
      if (user === null) {
        res.status(400).render("loginPage.hbs", {
          error: "User not found."
        });
      } else {
        //Using the bycrypt to compare the password input with the hashed password stored on the database
        bcrypt.compare(password, user.password, (err, resolve) => {
          if (resolve) {
            //Creating a session for the user and redirecting to /user endpoint
            //A registered user is given 'verified' accType and a guest is given 'anon' accType
            req.session.user = user;
            req.session.accType = "verified";
            res.redirect("/user");
          } else {
            res.status(400).render("loginPage.hbs", {
              error: "Wrong Password!"
            });
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
    res.status(500).send("Error with logout"); //Need to do something about this error
  }
});

//Exporting router variable
module.exports = {
  router
};
