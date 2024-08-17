const createError = require("http-errors");
const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

const dotenv = require("dotenv").config();
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cryto = require("crypto");

const app = express();

// setup body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json);

// setup express session
app.use(session({ secret: "secret", saveUninitialized: true, resave: true }));

// setup passport
app.use(passport.initialize());
app.use(passport.session());

// setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "./layouts/website.ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// ||||| ||||| ||||| ||||| ||||| ||||| ||||| |||||
// ||||| ||||| ||||| ||||| ||||| ||||| ||||| |||||

// setup routers
const { routes } = require("./routes/index");
const { configDotenv } = require("dotenv");
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || process.env.DEV_PORT;

app.listen(port, async function () {
  console.log("Server is running on ", port);
});




module.exports = app;
