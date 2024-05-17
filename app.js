// Import required modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const dotenv = require('dotenv');

//Import schedule Model
const PersonalSchedule = require('./models/schedule');
const users = require('./models/user');
const timeStamp = require('./models/timestamping');

// Import routers
const indexRouter = require('./routes/index');



// Load environment variables from .env file
dotenv.config({ path: './config.env' });

// Increase the maximum number of listeners
require('events').EventEmitter.defaultMaxListeners = 20;

// Initialize express app
const app = express();

// MongoDB connection
mongoose.set("strictQuery", false);
// Use environment variables for database credentials
const dev_db_url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@databaseNumber1.bxvhltu.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseNumber1";


// Function to connect to MongoDB
async function dbConnection() {
  try {
    await mongoose.connect(dev_db_url);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Could not connect to the database", error);
  }
}
// Connect to MongoDB
dbConnection();

// Session setup
// Use environment variable for session secret
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: secure should be true only in production (requires HTTPS)
}));

// Middleware to set user session data
app.use(async function(req, res, next) {
  if (req.session.user) {
    // Get 3 upcoming shifts from database
    const upcomingShifts = await PersonalSchedule.find({ email: req.session.user.email, date: { $gte: new Date() } }).sort({ date: 1 }).limit(3);
    const user = await users.findOne({ email: req.session.user.email});
    const timeStampingBool = await timeStamp.findOne({ email: req.session.user.email, endTime: { $exists: false } });
    
    // Destructure user session data for cleaner code
    permission = req.session.user.permission;
    res.locals = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      permission: user.permission,
      upcomingShifts: upcomingShifts,
      // if timestamp is not found, set timeStamp to false
      timeStamp: timeStampingBool ? timeStampingBool : false
    };
  } else {
    res.locals = { firstName: '', lastName: '', email: '', role: '', department: '', permission: '' };
  }
  next();
});







// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Use routers
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;