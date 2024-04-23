var express = require('express');
var router = express.Router();
var moment = require('moment');
const Users = require('../models/user');
const Schedule = require('../models/schedule');
const dateHandler = require('../functions/dateHandler');



async function GET_team_schedule(req, res) {
  if (!req.params.week || !req.params.year)
    res.redirect('/team_schedule/' + dateHandler.getCurrentYear() + '-' + dateHandler.getCurrentWeek());

  allUsers = await Users.find().exec();
  console.log(req.params.week, req.params.year);

  
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

  weekDates = dateHandler.generateWeek(req.params.year, req.params.week);
  console.log(weekDates);
  res.render('team_schedule', {
    week_number: req.params.week,
    weekDates: weekDates,
    users: userSchedules
  });
};


module.exports = {
    GET_team_schedule
};