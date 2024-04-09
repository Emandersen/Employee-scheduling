var express = require('express');
var router = express.Router();
var moment = require('moment');
const PersonalSchedule = require('../models/schedule');
const dateHandler = require('../functions/dateHandler');




// function: GET_personal_schedule
// description: This function fetches the personal schedule for the user and renders the schedule page.
// return: none
// parameters: req, res
// example: GET_personal_schedule(req, res)
async function GET_personal_schedule(req, res) {
  const weeks = [];
  const today = moment();
  const startWeek = today.clone().subtract(12, 'weeks');
  const endWeek = today.clone().add(12, 'weeks');

  // Generate weeks for the next 12 weeks
  for (let week = startWeek; week.isBefore(endWeek); week.add(1, 'week')) {
    const year = week.year();
    const weekNumber = week.week();

    // Fetch workDays from the database for the current week
    const startDate = week.clone().startOf('week').toDate();
    const endDate = week.clone().endOf('week').toDate();
    const workDays = await PersonalSchedule.find({
      email: req.session.user.email,
      date: { $gte: startDate, $lte: endDate }
    });

    // Generate the week object and add it to the weeks array
    weeks.push(dateHandler.generateWeek(year, weekNumber, workDays));
  }
  
  res.render('personal_schedule', { title: 'Work Schedule', weeks: weeks, currentWeek: dateHandler.getCurrentWeek()});
};

// function: POST_release_shift
// description: This function releases a shift for other users to pick up.
// return: none
// parameters: req, res
// example: POST_release_shift(req, res)
function POST_release_shift(req, res) {
  console.log("Missing implementation for releasing a shift")

  // Redirect back to the schedule page
  res.redirect('/');
};

// function: POST_unrelease_shift
// description: This function un-releases a shift for other users to pick up.
// return: none
// parameters: req, res
// example: POST_unrelease_shift(req, res)
function POST_unrelease_shift(req, res) {
  console.log("Missing implementation for releasing a shift")

  // Redirect back to the schedule page
  res.redirect('/');
};

module.exports = {
  GET_personal_schedule,
  POST_release_shift,
  POST_unrelease_shift
}; 
