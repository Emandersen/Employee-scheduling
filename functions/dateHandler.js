// function: getCurrentWeek
// description: This function returns the current week number of the year.
// return: weekNumber
// parameters: none
// example: getCurrentWeek()
function getCurrentWeek() {
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.round((today - firstDay) / 86400000);
  const weekNumber = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);

  return weekNumber;
}


// function: generateWeek
// description: This function generates a week object with the given year, week number and work days amd 
// fills it with the days of the week.
// return: week
// parameters: year, weekNumber, workDays
// example: generateWeek(2021, 1, [])
function generateWeek(year, weekNumber, workDays = [], releasedShifts = []) {
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

    const releasedShift = releasedShifts.find(d => {
      const releasedShiftDate = new Date(d.date);
      return releasedShiftDate.getDate() === date.getDate() &&
        releasedShiftDate.getMonth() === date.getMonth() &&
        releasedShiftDate.getFullYear() === date.getFullYear();
    });



    // Add the day to the week object
    week.days.push({
      id: workDay ? workDay.id : releasedShift ? releasedShift.id : undefined,
      released: workDay ? workDay.released : releasedShift ? releasedShift.released : undefined,
      date: days[date.getDay()] + ' ' + day + '. ' + months[date.getMonth()] + ' ' + date.getFullYear(),
      workHours: workDay ? workDay.workHours : releasedShift ? releasedShift.workHours : 0,
      startTime: workDay ? workDay.startTime : releasedShift ? releasedShift.startTime : undefined,
      endTime: workDay ? workDay.endTime : releasedShift ? releasedShift.endTime : undefined,
      role: workDay ? workDay.role : releasedShift ? releasedShift.role : undefined,
      department: workDay ? workDay.department : releasedShift ? releasedShift.department : undefined,
    location: workDay ? workDay.location : releasedShift ? releasedShift.location : undefined,
    email: workDay ? workDay.email : releasedShift ? releasedShift.email : undefined
    });
    date.setDate(date.getDate() + 1);
  }

  return week;
};

function fillMissingDates(start, end, schedules) {
  const datesWithSchedules = [];
  let date = new Date(start);
  while (date < end) {
    const schedule = schedules.find(s => {
      const scheduleDate = new Date(s.date);
      return scheduleDate.getDate() === date.getDate() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getFullYear() === date.getFullYear();
    });
    datesWithSchedules.push(schedule || {
      date: date,
      workHours: 0,
      startTime: undefined,
      endTime: undefined,
      role: undefined,
      department: undefined,
      location: undefined,
      email: undefined
    });
    date.setDate(date.getDate() + 1);
  }
  return datesWithSchedules;
};

function generateDates(startDate, endDate) {
  const dates = [];
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  let date = new Date(startDate);
  while (date <= endDate) {
    const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    dates.push(formattedDate);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

function getStartWeek(weeknumber = getCurrentWeek(), year = new Date().getFullYear()) {
  return new Date(year, 0, 1 + (weeknumber - 1) * 7);
}

function getEndWeek(weeknumber = getCurrentWeek(), year = new Date().getFullYear()) {
  return new Date(year, 0, 1 + (weeknumber - 1) * 7 + 6);
}

function getCurrentYear() {
  return new Date().getFullYear();
}
 

// Statistics //
// Normtider, afspadsering og ferie //
// gennemsnitlige timer pr. uge og pr. måned //
//This function cannot pass the test for boundary dates
//please fix
function userNormWorkHours(schedule, req) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const quarters = [
      { start: new Date(currentYear, 0, 1), end: new Date(currentYear, 2, 31) }, // Q1: Jan. 1 - Mar. 31
      { start: new Date(currentYear, 3, 1), end: new Date(currentYear, 5, 30) }, // Q2: Apr. 1 - Jun. 30
      { start: new Date(currentYear, 6, 1), end: new Date(currentYear, 8, 30) }, // Q3: Jul. 1 - Sep. 30
      { start: new Date(currentYear, 9, 1), end: new Date(currentYear, 11, 31) }  // Q4: Oct. 1 - Dec. 31
  ];

  const accumulativeWorkHoursByQuarter = quarters.map(quarter => {
      // Filter schedule data for the current quarter
      const filteredData = schedule.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= quarter.start && itemDate <= quarter.end;
      });

      // Calculate total work hours for the current quarter
      const totalWorkHours = filteredData.reduce((total, item) => total + item.workHours, 0);

      return totalWorkHours;
  });

  return accumulativeWorkHoursByQuarter;
}

async function calculateOverwork(req, res, timeStampModel, PersonalSchedule) {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const timeStamp = await timeStampModel.findOne({ email: req.session.user.email, verified: true });

    if (!timeStamp) {
      throw new Error('No verified stamp found for today');
    }

    const startTime = timeStamp.startTime;
    const endTime = timeStamp.endTime || new Date();

    // Retrieve the scheduled shift for the current date
    const scheduledShift = await PersonalSchedule.findOne({ email: req.session.user.email, date: currentDate });

    if (!scheduledShift) {
      throw new Error('No scheduled shift found for today');
    }

    const scheduledStartTime = scheduledShift.startTime;
    const scheduledEndTime = scheduledShift.endTime;

    // Calculate overwork hours
    const timeStampDuration = endTime.getTime() - startTime.getTime();
    const scheduledDuration = scheduledEndTime.getTime() - scheduledStartTime.getTime();
    const overworkMilliseconds = timeStampDuration - scheduledDuration;
    const overworkHours = overworkMilliseconds / (1000 * 60 * 60);

    return overworkHours;
  }
  catch (error) {
    console.error(`Error calculating overwork: ${error.message}`);
    res.redirect('/?error=An error occurred');
  }
}


module.exports = {
getCurrentWeek,
generateWeek,
fillMissingDates,
generateDates,
getStartWeek,
getEndWeek,
getCurrentYear,
userNormWorkHours,
calculateOverwork
};