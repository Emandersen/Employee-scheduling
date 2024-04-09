var express = require('express');
var router = express.Router();
var moment = require('moment');
const Users = require('../models/user');
const personalSchedule = require('./personalscheduleController');
const dateHandler = require('../functions/dateHandler');

function daysInAWeek() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days;
}


async function GET_team_schedule(req, res) {
  const allNames = await Users.find().sort({lastName: 1}).exec();
  let arr = [];
  
  for(i = 0; i <= allNames.length - 1; i++) {
      arr.push(allNames[i].firstName + " " + allNames[i].lastName);
  }

  res.render('team_schedule', {
    week_number: dateHandler.getCurrentWeek(),
    names: arr,
    weekDays: daysInAWeek()
  });
};


module.exports = {
    GET_team_schedule
};