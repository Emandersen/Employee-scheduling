// function: getCurrentWeek
// description: This function returns the current week number of the year.
// return: weekNumber
// parameters: none

const user = require("../models/user");

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

function fillMissingDates(start, end, schedules, user) {
  const datesWithSchedules = [];
  let date = new Date(start);
  while (date < end) {
    const schedule = schedules.find(s => {
      const scheduleDate = new Date(s.date);
      return scheduleDate.getDate() === date.getDate() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getFullYear() === date.getFullYear();
    });

    const vacationDay = user.vacationDays.find(v => {
      const vacationDate = new Date(v[1]);
      return vacationDate.getDate() === date.getDate() &&
        vacationDate.getMonth() === date.getMonth() &&
        vacationDate.getFullYear() === date.getFullYear();
    });

    const isVacation = vacationDay ? true : false;

    const isWorkhours = schedule ? true : false;
    
    var blockColor = "";

    if (isVacation) {
      if (vacationDay[0] == true) {
        blockColor = "#e68cfa"; // pink
      } else if (vacationDay[0] == false) {
        blockColor = "#b56bfa"; // Dark purple
      }
    }

    if (isWorkhours && !isVacation) {
      blockColor = "#89fafa"; // Light blue
    }
    

    datesWithSchedules.push({
      ...schedule,
      blockColor,
      date: date.toISOString(),
      workHours: schedule ? schedule.workHours : 0,
      startTime: schedule ? schedule.startTime : undefined,
      endTime: schedule ? schedule.endTime : undefined,
      role: schedule ? schedule.role : undefined,
      department: schedule ? schedule.department : undefined,
      location: schedule ? schedule.location : undefined,
      email: schedule ? schedule.email : undefined
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

function currentQuarter() {
  const today = new Date();
  return Math.floor((today.getMonth() + 3) / 3);
}
 

// Statistics //
// Normtider, afspadsering og ferie //
// gennemsnitlige timer pr. uge og pr. måned //
function userNormWorkHours(schedule) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const quarters = [
    { start: new Date(currentYear, 0, 1, 0, 0, 0, 0), end: new Date(currentYear, 2, 31, 23, 59, 59, 999) }, // Q1: Jan. 1 - Mar. 31
    { start: new Date(currentYear, 3, 1, 0, 0, 0, 0), end: new Date(currentYear, 5, 30, 23, 59, 59, 999) }, // Q2: Apr. 1 - Jun. 30
    { start: new Date(currentYear, 6, 1, 0, 0, 0, 0), end: new Date(currentYear, 8, 30, 23, 59, 59, 999) }, // Q3: Jul. 1 - Sep. 30
    { start: new Date(currentYear, 9, 1, 0, 0, 0, 0), end: new Date(currentYear, 11, 31, 23, 59, 59, 999) }, // Q4: Oct. 1 - Dec. 31
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

function normHoursCurrentQuarter(userNormWorkHours, currentQuarter) {
  switch (currentQuarter) {
    case 1:
      return userNormWorkHours[0];
    case 2:
      return userNormWorkHours[1];
    case 3:
      return userNormWorkHours[2];
    case 4:
      return userNormWorkHours[3];
    default:
      console.log('error');
  }
}

async function calculateOverwork(req, res, timeStampModel, PersonalSchedule) {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Retrieve the scheduled shift for the current date
    const scheduledShift = await PersonalSchedule.findOne({ email: req.session.user.email, date: currentDate });

    if (!scheduledShift) {
      return 0;
    }

    const timeStamp = await timeStampModel.findOne({ email: req.session.user.email, verified: true });

    if (!timeStamp) {
      throw new Error('No verified stamp found for today');
    }

    const startTime = timeStamp.startTime;
    const endTime = timeStamp.endTime || new Date();

    const scheduledStartTime = scheduledShift.startTime;
    const scheduledEndTime = scheduledShift.endTime;

    // Calculate overwork hours
    const timeStampDuration = endTime.getTime() - startTime.getTime();
    const scheduledDuration = scheduledEndTime.getTime() - scheduledStartTime.getTime();
    const overworkMilliseconds = timeStampDuration - scheduledDuration;
    const overworkHours = overworkMilliseconds / (1000 * 60 * 60);

    console.log(overworkHours);
    return overworkHours;
  }
  catch (error) {
    console.error(`Error calculating overwork: ${error.message}`);
    res.redirect('/?error=An error occurred');
  }
}

//2,08 dages ferie pr. måned. Ferieåret er fra d. 1. september til og med d. 31. august året efter//
//Ferieafholdelsesperioden er dog på 16 måneder fra den 1. september til den 31. december året efter//
//Man har ret til 25 feriedage i løbet af disse 16 måneder og de kan ikke transfers videre//
async function vacationRegistration(req, User) {
  try {
    const user = await User.find({ user: req.body.user });
    const vacationDays = 25;
    let vacationDaysVerified = 0;

    if (!user.vacationDays || user.vacationDays.length === 0) {
      return { message: 'There are no vacation day requests from this user.' };
    }
    
    for(let i = 0; i < user.vacationDays.length; i++) {
      if (user.vacationDays[i][0] == true) {
        vacationDaysVerified += 1;
      }
    }

    console.log(vacationDaysVerified);
    let vacationDaysLeft = vacationDays - vacationDaysVerified;

    return vacationDaysLeft;
  }
  catch (error) {
    console.error('Error during vacation registration:', error);
    return { message: 'An error occured during vacation registration.', error: error.message };
  } 
}

//skal lave funktion der finder vacationdaylimit med user som input og boolean som output//
function checkVacationDayLimit(req, User) {
  const vacationDaysLeft = vacationRegistration(req, User);

  if (vacationDaysLeft <= 0) {
    return false;
  }
  else {
    return true;
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
calculateOverwork,
currentQuarter,
normHoursCurrentQuarter,
vacationRegistration,
checkVacationDayLimit
};