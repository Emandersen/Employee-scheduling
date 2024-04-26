const express = require('express');
const moment = require('moment');
const PersonalSchedule = require('../models/schedule');
const User = require('../models/user');
const dateHandler = require('../functions/dateHandler');

async function GET_personal_schedule(req, res) {
  try {
    const weeks = [];
    const today = moment();
    const startWeek = today.clone().subtract(12, 'weeks');
    const endWeek = today.clone().add(12, 'weeks');

    const allWorkDays = await PersonalSchedule.find({
      email: req.session.user.email,
      date: { $gte: startWeek.toDate(), $lte: endWeek.toDate() }
    });

    const allReleasedShifts = await PersonalSchedule.find({
      date: { $gte: startWeek.toDate(), $lte: endWeek.toDate() },
      released: true
    });

    for (let week = startWeek; week.isBefore(endWeek); week.add(1, 'week')) {
      const startDate = week.clone().startOf('week').toDate();
      const endDate = week.clone().endOf('week').toDate();
      const workDays = allWorkDays.filter(workDay => workDay.date >= startDate && workDay.date <= endDate);
      const releasedShifts = allReleasedShifts.filter(shift => shift.date >= startDate && shift.date <= endDate);

      weeks.push(dateHandler.generateWeek(week.year(), week.week(), workDays, releasedShifts, req.session.user.vacationDays));
    }

    res.render('personal_schedule', {
      title: 'Work Schedule',
      weeks: weeks,
      currentWeek: dateHandler.getCurrentWeek(),
      moment: moment,
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.redirect('/?error=An error occurred');
  }
};

async function POST_toggle_shift(req, res) {
  try {
    const schedule = await PersonalSchedule.findById(req.params.dayId);

    if (!schedule) {
      res.redirect('/?error=Schedule not found');
      return;
    }

    schedule.released = !schedule.released;

    if (!schedule.released) {
      schedule.email = req.session.user.email;
    }

    await schedule.save();

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/?error=An error occurred');
  }
};

async function POST_toggle_vacation(req, res) {
  try {
    let year = new Date().getFullYear();
    let date = moment.utc(req.params.dayId + ' ' + year, 'dddd D. MMMM YYYY').startOf('day');
    if (!date.isValid()) {
      console.error('Invalid date format');
      return;
    }
    let isoDate = date.format('YYYY-MM-DDTHH:mm:ss.SSS+00:00');

    const schedule = await PersonalSchedule.findOne({ email: req.session.user.email, date: isoDate });

    if (!schedule || !schedule.released) {
      const specificUser = await User.findOne({ email: req.session.user.email });
      if (specificUser) {
        const update = specificUser.vacationDays.includes(isoDate)
          ? { $pull: { vacationDays: isoDate } }
          : { $addToSet: { vacationDays: isoDate } };

        await User.findOneAndUpdate({ email: req.session.user.email }, update);

        // Update the session data
        if (update.$pull) {
          req.session.user.vacationDays = req.session.user.vacationDays.filter(day => day !== isoDate);
        } else if (update.$addToSet) {
          req.session.user.vacationDays.push(isoDate);
        }
      }
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/?error=An error occurred');
  }
};

module.exports = {
  GET_personal_schedule,
  POST_toggle_shift,
  POST_toggle_vacation
};