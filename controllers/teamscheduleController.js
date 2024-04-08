var express = require('express');
var router = express.Router();
var moment = require('moment');
const Users = require('../models/user');



function getCurrentWeek() {
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.round((today - firstDay) / 86400000);
    const weekNumber = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
  
    return weekNumber;
  }

async function GET_team_schedule(req, res) {
  const allNames = await Users.find({
    firstName: Users.firstName,
    lastName: Users.lastName,
  })
  res.render('team_schedule', {week_number: getCurrentWeek()});
};


module.exports = {
    GET_team_schedule
};