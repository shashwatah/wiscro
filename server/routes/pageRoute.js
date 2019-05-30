//Importing modules
const express = require("express");
const bodyParser = require("body-parser");

//Creating router
const router = express.Router();

//Middlewares
const { sessionChecker } = require("./../middleware/sessionChecker.js");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());

//Main page endpoint
router.get("/", sessionChecker, (req, res) => {
  res.render("indexPage.hbs");
});

//Register page endpoint
router.get("/reg", sessionChecker, (req, res) => {
  res.render("registerPage.hbs");
});

//Login page endpoint
router.get("/log", sessionChecker, (req, res) => {
  res.render("loginPage.hbs");
});

//User page endpoint
router.get("/user", (req, res) => {
  //Checking if the session variable user and cookie exit
  if (req.session.user && req.cookies.user_sid) {
    //If true
    //Render user page with the template data
    res.render("userPage.hbs", {
      username: req.session.user.username
    });
  } else {
    //If false
    //Redirect back to main page
    res.redirect("/");
  }
});

router.get("/about", (req, res) => {
  res.render("about.hbs");
});

//Exporting router variable
module.exports = {
  router
};
