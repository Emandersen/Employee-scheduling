var express = require('express');
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

  // Fetch all workDays from the database for the given email within the time period
  const allWorkDays = await PersonalSchedule.find({
    email: req.session.user.email,
    date: { $gte: startWeek.toDate(), $lte: endWeek.toDate() }
  });

  // Fetch all released shifts from the database for the given email within the time period
  const allReleasedShifts = await PersonalSchedule.find({
    date: { $gte: startWeek.toDate(), $lte: endWeek.toDate() },
    released: true // Only find documents where 'released' is true
  });

  // Generate weeks for the next 12 weeks
  for (let week = startWeek; week.isBefore(endWeek); week.add(1, 'week')) {
    const year = week.year();
    const weekNumber = week.week();

    // Filter workDays and releasedShifts for the current week
    const startDate = week.clone().startOf('week').toDate();
    const endDate = week.clone().endOf('week').toDate();
    const workDays = allWorkDays.filter(workDay => workDay.date >= startDate && workDay.date <= endDate);
    const releasedShifts = allReleasedShifts.filter(shift => shift.date >= startDate && shift.date <= endDate);

    // Generate the week object and add it to the weeks array
    weeks.push(dateHandler.generateWeek(year, weekNumber, workDays, releasedShifts));
  }
  console.log('released shifts:', allReleasedShifts)
  
  res.render('personal_schedule', { title: 'Work Schedule', weeks: weeks, currentWeek: dateHandler.getCurrentWeek()});
};


// function: POST_toggleshift
// description: This function toggles the 'released' field of a schedule.
// return: none
// parameters: req, res
// example: POST_toggleshift(req, res)
async function POST_toggle_shift(req, res) {
  try {
    console.log('dayId:', req.params.dayId);

    // Find the schedule by its ID
    const schedule = await PersonalSchedule.findById(req.params.dayId);
    console.log('schedule:', schedule);

    if (!schedule) {
      res.redirect('/?error=Schedule not found');
      return;
    }

    // Toggle the 'released' field
    schedule.released = !schedule.released;

    // If the shift is now claimed, change the email to the session email
    if (!schedule.released) {
      schedule.email = req.session.user.email;
    }

    // Save the updated schedule
    await schedule.save();

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/?error=An error occurred');
  }
};


module.exports = {
  GET_personal_schedule,
  POST_toggle_shift
}; 
