var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });


var app = express();

// MongoDB connection
mongoose.set("strictQuery", false);
const dev_db_url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@databasenumber1.bxvhltu.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseNumber1";

async function dbConnection() {
  try {
    await mongoose.connect(dev_db_url);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Could not connect to the database", error);
  }
}
dbConnection();

// Session setup
const session = require('express-session');

app.use(session({
  secret: 'This is a secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: secure should be true only in production (requires HTTPS)
}));

app.use(function(req, res, next) {
  if (req.session.user) {
    res.locals.firstName = req.session.user.firstName;
    res.locals.lastName = req.session.user.lastName;
    res.locals.email = req.session.user.email;
    res.locals.role = req.session.user.role;
    res.locals.department = req.session.user.department; // Add this line
  } else {
    res.locals.firstName = '';
    res.locals.lastName = '';
    res.locals.email = '';
    res.locals.role = '';
    res.locals.department = ''; // And this line
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
