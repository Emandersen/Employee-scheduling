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
        date: days[date.getDay()] + ' ' + day + '. ' + months[date.getMonth()],
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

function generateDates(year, months) {
	let dates = [];
	let monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	for (let month of months) {
		let date = new Date(year, month - 1);
		while (date.getMonth() === month - 1) {
			let formattedDate = date.getDate() + '. ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
			dates.push(formattedDate);
			date.setDate(date.getDate() + 1);
			
		}
	}
	return dates;
}

async function getWeekForDate(date) {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function fillMissingDates(startDate, endDate, schedules) {
	const datesWithSchedules = [];
	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		const schedule = schedules.find(schedule => {
			const scheduleDate = new Date(schedule.date);
			return scheduleDate.getDate() === currentDate.getDate() &&
				scheduleDate.getMonth() === currentDate.getMonth() &&
				scheduleDate.getFullYear() === currentDate.getFullYear();
		});

		datesWithSchedules.push({
			date: new Date(currentDate),
			schedule: schedule || { /* default schedule */ }
		});

		currentDate.setDate(currentDate.getDate() + 1);
	}

	return datesWithSchedules;
}

module.exports = {
	getCurrentWeek,
	generateWeek,
	generateDates,
	getWeekForDate,
	fillMissingDates
	
};