var express = require('express');
var router = express.Router();
var moment = require('moment');



function getCurrentWeek() {
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.round((today - firstDay) / 86400000);
    const weekNumber = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
  
    return weekNumber;
  }

  function GET_team_schedule(req, res) {
    res.render('team_schedule', { week_number: getCurrentWeek()});
};

module.exports = {
    GET_team_schedule
};