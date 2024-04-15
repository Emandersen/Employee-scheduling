var express = require('express');
var router = express.Router();
var moment = require('moment');
const Users = require('../models/user');
const Schedule = require('../models/schedule');
const dateHandler = require('../functions/dateHandler');



async function GET_team_schedule(req, res) {
  const allNames = await Users.find().exec();
  var arr = [];

  for (i = 0; i <= allNames.length - 1; i++) {
    arr.push(allNames[i].firstName + " " + allNames[i].lastName);
  }


  var weekStart = moment(`2024W18`).add(1, 'days').toDate();
  var weekEnd = moment(`2024W18`).add(7, 'days').toDate();

  const allSchedules = await Schedule.find({
    date: { $gte: weekStart, $lte: weekEnd}
  }).exec();
  var userSchedules = {};

  allNames.forEach(nameElement => {
    var userSchedule = [];
    
    userSchedules[nameElement.email] = userSchedule;

    allSchedules.forEach(scheduleElement => {
      if (scheduleElement.email == nameElement.email) {
        userSchedules[nameElement.email].push(scheduleElement)

      }
    });
  });
console.log(userSchedules);
  

  

  res.render('team_schedule', {
    week_number: dateHandler.getCurrentWeek(),
    names: arr,
    weekDays: [],
  });
};


module.exports = {
    GET_team_schedule
};