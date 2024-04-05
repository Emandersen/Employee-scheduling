var express = require('express');
var router = express.Router();
var moment = require('moment');
const PersonalSchedule = require('../models/schedule');

let dayId = 0;
// Dummy data for the work days
const workDays = [
  {
    id: dayId++,
    date: new Date(2024, 3, 1), // April 1, 2024
    workHours: 8,
    startTime: '09:00',
    endTime: '17:00',
    role: 'Nurse',
    department: 'Emergency',
    location: 'Hvidovre',
    released: false
  },
  {
    id: dayId++,
    date: new Date(2024, 3, 2), // April 2, 2024
    workHours: 8,
    startTime: '09:00',
    endTime: '17:00',
    role: 'Nurse',
    department: 'Emergency',
    location: 'Hvidovre',
    released: false
  },
  {
    id: dayId++,
    date: new Date(2024, 4, 15), // May 15, 2024
    workHours: 8,
    startTime: '09:00',
    endTime: '17:00',
    role: 'Nurse',
    department: 'Emergency',
    location: 'Hvidovre',
    released: true
  },
  // Continue adding data for the next days...
];



function getCurrentWeek() {
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.round((today - firstDay) / 86400000);
  const weekNumber = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);

  return weekNumber;
}

function generateWeek(year, weekNumber, workDays = []) {
  // Create a date object at the start of the week
  const date = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const week = {
    number: weekNumber,
    year: year,
    days: []
  };

  // Add each day in the week
  for (let i = 0; i < 7; i++) {
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const workDay = workDays.find(d => {
      const workDayDate = new Date(d.date);
      return workDayDate.getDate() === date.getDate() &&
        workDayDate.getMonth() === date.getMonth() &&
        workDayDate.getFullYear() === date.getFullYear();
    });

    week.days.push({
      id: workDay ? workDay.id : undefined,
      released: workDay ? workDay.released : undefined,
      date: days[date.getDay()] + ' ' + day + '. ' + months[date.getMonth()],
      workHours: workDay ? workDay.workHours : 0,
      startTime: workDay ? workDay.startTime : undefined,
      endTime: workDay ? workDay.endTime : undefined,
      role: workDay ? workDay.role : undefined,
      department: workDay ? workDay.department : undefined,
      location: workDay ? workDay.location : undefined
    });
    date.setDate(date.getDate() + 1);
  }

  return week;
}


async function GET_personal_schedule(req, res) {
  const weeks = [];
  const today = moment();
  const startWeek = today.clone().subtract(12, 'weeks');
  const endWeek = today.clone().add(12, 'weeks');

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

    weeks.push(generateWeek(year, weekNumber, workDays));
  }

  res.render('personal_schedule', { title: 'Work Schedule', weeks: weeks, currentWeek: getCurrentWeek() });
};

function POST_release_shift(req, res) {
  console.log("Missing implementation for releasing a shift")

  // Redirect back to the schedule page
  res.redirect('/');
};

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
