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
    date: { $gte: weekStart, $lte: weekEnd}
  }).exec();

  var userSchedules = {};

  allUsers.forEach(nameElement => {
    var userSchedule = [];

    // Generate a week's worth of dates
    let week = dateHandler.generateWeek(2024, dateHandler.getCurrentWeek(), allSchedules);

    week.days.forEach(day => {
      // Find a schedule for this date
      let schedule = allSchedules.find(scheduleElement => 
        scheduleElement.email == nameElement.email && 
        scheduleElement.date.toISOString().slice(0,10) == new Date(day.date).toISOString().slice(0,10)
      );

      // If there's no schedule for this date, add a placeholder schedule
      if (!schedule) {
        schedule = {
          email: nameElement.email,
          date: day.date,
          // Add any other properties you need for a placeholder schedule
        };
      }

      userSchedule.push(schedule);
    });

    userSchedules[nameElement.email] = userSchedule;
  });
  
  
  // Sort User schedules from earliest to latest
  for (let key in userSchedules) {
    userSchedules[key].sort(function(a, b) {
      return a.date - b.date;
    });
  }

  // set the key in userSchedules to the allUsers array
  
  let users = [];
  allUsers.forEach(user => {
    users.push({
      user,
      allSchedules: userSchedules[user.email]
    });
  });

  

  console.log(users);
  console.log(users)


  res.render('team_schedule', {
    week_number: dateHandler.getCurrentWeek(),
    weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    users: users
  });
};


module.exports = {
    GET_team_schedule
};