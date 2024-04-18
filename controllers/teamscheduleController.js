var express = require('express');
var router = express.Router();
var moment = require('moment');
const Users = require('../models/user');
const Schedule = require('../models/schedule');
const dateHandler = require('../functions/dateHandler');



async function GET_team_schedule(req, res) {
  allUsers = await Users.find().exec();


  if (req.query.week && req.query.year) {
    var weekStart = dateHandler.getStartWeek(req.query.week, req.query.year); 
    var weekEnd = dateHandler.getWeekEnd(req.query.week, req.query.year);
  } else {
    var weekStart = dateHandler.getStartWeek(); 
    var weekEnd = dateHandler.getEndWeek();
  }

  const allSchedules = await Schedule.find({
    date: { $gte: weekStart, $lte: weekEnd},
  }).exec();

  var userSchedules = [];

  allUsers.forEach(nameElement => {
    var currentUser = allSchedules.filter(schedule => schedule.email == nameElement.email);

    // Generate a week's worth of dates for the current iterating user
    let week = dateHandler.generateWeek(2024, dateHandler.getCurrentWeek(), currentUser);

    let userSchedule = {
      user: nameElement,
      week
    }

    userSchedules.push(userSchedule);



  });

  weekDates = dateHandler.generateWeek(2024, dateHandler.getCurrentWeek());
  console.log(weekDates);
  res.render('team_schedule', {
    week_number: dateHandler.getCurrentWeek(),
    weekDates: weekDates,
    users: userSchedules
  });
};


module.exports = {
    GET_team_schedule
};