var express = require('express');
var router = express.Router();
var moment = require('moment');
const Users = require('../models/user');
const Schedule = require('../models/schedule');
const dateHandler = require('../functions/dateHandler');



async function GET_team_schedule(req, res) {
  if (!req.params.week || !req.params.year) {
    return res.redirect('/team_schedule/' + dateHandler.getCurrentYear() + '-' + dateHandler.getCurrentWeek());
  }
  
  allUsers = await Users.find().exec();
  
  
  var weekStart = dateHandler.getStartWeek(req.params.week, req.params.year); 
  var weekEnd = dateHandler.getEndWeek(req.params.week, req.params.year);


  const allSchedules = await Schedule.find({
    date: { $gte: weekStart, $lte: weekEnd},
  }).exec();

  var userSchedules = [];

  allUsers.forEach(nameElement => {
    var currentUser = allSchedules.filter(schedule => schedule.email == nameElement.email);

    // Generate a week's worth of dates for the current iterating user
    let week = dateHandler.generateWeek(req.params.year, req.params.week, currentUser);

    let userSchedule = {
      user: nameElement,
      week
    }

    userSchedules.push(userSchedule);
  });
  currentParams = {
    week_number: req.params.week,
    year: req.params.year
  }

  weekDates = dateHandler.generateWeek(req.params.year, req.params.week);
  res.render('team_schedule', {
    currentParams: currentParams,
    weekDates: weekDates,
    users: userSchedules
  });
};

async function POST_next_week(req, res) {
  var currentWeek = parseInt((req.body.week_number), 10);
  var currentYear = parseInt((req.body.year), 10);

  var nextWeek = currentWeek + 1;
  var nextYear = currentYear;

  if (nextWeek > 52) {
    nextWeek = 1;
    nextYear = currentYear + 1;
  }

  res.redirect('/team_schedule/' + nextYear + '-' + nextWeek);
};

async function POST_previous_week(req, res) {
  var currentWeek = parseInt((req.body.week_number), 10);
  var currentYear = parseInt((req.body.year), 10);

  var previousWeek = currentWeek - 1;
  var previousYear = currentYear;

  if (previousWeek < 1) {
    previousWeek = 52;
    previousYear = currentYear - 1;
  }

  res.redirect('/team_schedule/' + previousYear + '-' + previousWeek);
};

module.exports = {
  GET_team_schedule,
  POST_next_week,
  POST_previous_week
};