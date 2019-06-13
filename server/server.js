//Importing modules
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morganLogger = require("morgan");
const crypto = require("crypto");
//Importing modules

/*The constant port will be set to 108 for localhost and for deployment it will be set to the port 
provided in the environment variable PORT*/
const port = process.env.PORT || 108;
const server = express();

//Database connection and models
const { mongoose } = require("./db/mongoose.js");
const { User } = require("./models/user.js");
const { Question } = require("./models/question.js");

//Importing the route files
const authRoute = require("./routes/authRoute.js");
const pageRoute = require("./routes/pageRoute.js");
const postRoute = require("./routes/postRoute.js");
const getRoute = require("./routes/getRoute.js");

//Middlewares
const { sessionChecker } = require("./middleware/sessionChecker.js");

//Utils
const { updateQuestionStatus } = require("./utils/updateQuestionStatus.js");

server.use(express.static(path.join(__dirname, "../public")));
server.use(
  bodyParser.urlencoded({
    extended: false
  })
);
server.use(bodyParser.json());
server.use(cookieParser());
server.use(morganLogger("dev"));

//Setting up the session and cookie
server.use(
  session({
    key: "user_sid",
    secret: crypto.randomBytes(20).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

//Deleting the cookie if the cookie is sent but the user does not exist in the session
server.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

//Using the routers from the route files

// Route: Authentication
server.use(authRoute.router);
// Route: Authentication

// Route: Pages
server.use(pageRoute.router);
// Route: Pages

// Route: Post Route
server.use(postRoute.router);
// Route: Post Route

// Route: Get Route
server.use(getRoute.router);
// Route: Get Route

// 404 Page Not Found
server.use(function(req, res, next) {
  res.status(404).render("404.hbs");
});
// 404 Page Not Found

setInterval(updateQuestionStatus, 60000, Question);

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
