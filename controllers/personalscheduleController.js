var express = require('express');
var moment = require('moment');
const PersonalSchedule = require('../models/schedule');
const dateHandler = require('../functions/dateHandler');
const schedule = require('../models/schedule');
const user = require('../models/user');




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
  
  res.render('personal_schedule', { title: 'Work Schedule', weeks: weeks, currentWeek: dateHandler.getCurrentWeek(), moment: moment});
};


// function: POST_toggleshift
// description: This function toggles the 'released' field of a schedule.
// return: none
// parameters: req, res
// example: POST_toggleshift(req, res)
async function POST_toggle_shift(req, res) {
  try {

    // Find the schedule by its ID
    const schedule = await PersonalSchedule.findById(req.params.dayId);

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

async function POST_toggle_vacation(req, res) {
	let schedule;
	console.log('date: ' + req.params.dayId);

	let year = new Date().getFullYear(); // Use the current year
	let date = moment(req.params.dayId + ' ' + year, 'dddd D. MMMM YYYY');
	if (!date.isValid()) {
		console.error('Invalid date format');
		return;
	}
	let isoDate = date.format();

	schedule = await PersonalSchedule.findOne({ email: req.session.user.email, date: isoDate });
	console.log('schedule:', schedule);

	if (!schedule || !schedule.released) {
		try {
			const specificUser = await user.findOne({ email: req.session.user.email });
			if (specificUser) {
				if (specificUser.vacationDays.includes(isoDate)) {
					await user.findOneAndUpdate(
						{ email: req.session.user.email },
						{ $pull: { vacationDays: isoDate } }
					);
				} else {
					await user.findOneAndUpdate(
						{ email: req.session.user.email },
						{ $addToSet: { vacationDays: isoDate } }
					);
				}
			}
		} catch (error) {
			console.error(error);
			res.redirect('/?error=An error occurred');
		}
	}
	
	res.redirect('/');
};




module.exports = {
	GET_personal_schedule,
	POST_toggle_shift,
	POST_toggle_vacation
}; 
