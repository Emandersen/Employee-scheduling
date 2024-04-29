const { format, isSameDay, startOfWeek, endOfWeek, getWeek, getYear, addDays } = require('date-fns');

function getCurrentWeek() {
  return getWeek(new Date(), { weekStartsOn: 1 });
}

function generateWeek(year, weekNumber, workDays = [], releasedShifts = [], vacationDays = []) {
  const start = startOfWeek(new Date(year, 0, 1 + (weekNumber - 1) * 7), { weekStartsOn: 1 });
  const week = {
    number: weekNumber,
    year: year,
    days: []
  };

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const workDay = workDays.find(d => isSameDay(new Date(d.date), date));
    const releasedShift = releasedShifts.find(d => isSameDay(new Date(d.date), date));
    const isVacationDay = vacationDays.some(vacationDay => isSameDay(new Date(vacationDay), date));

    week.days.push({
      id: workDay ? workDay.id : releasedShift ? releasedShift.id : undefined,
      released: workDay ? workDay.released : releasedShift ? releasedShift.released : undefined,
      date: format(date, 'EEEE dd. MMMM yyyy'),
      workHours: workDay ? workDay.workHours : releasedShift ? releasedShift.workHours : 0,
      startTime: workDay ? workDay.startTime : releasedShift ? releasedShift.startTime : undefined,
      endTime: workDay ? workDay.endTime : releasedShift ? releasedShift.endTime : undefined,
      role: workDay ? workDay.role : releasedShift ? releasedShift.role : undefined,
      department: workDay ? workDay.department : releasedShift ? releasedShift.department : undefined,
      location: workDay ? workDay.location : releasedShift ? releasedShift.location : undefined,
      email: workDay ? workDay.email : releasedShift ? releasedShift.email : undefined,
      vacation: isVacationDay
    });
  }

  return week;
}

function fillMissingDates(start, end, schedules) {
  const datesWithSchedules = [];
  let date = new Date(start);
  while (date < end) {
    const schedule = schedules.find(s => isSameDay(new Date(s.date), date));
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
}

function generateDates(startDate, endDate) {
  const dates = [];
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  let date = new Date(startDate);
  while (date <= endDate) {
    const formattedDate = format(date, 'yyyy-MM-dd');
    dates.push(formattedDate);
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

function getStartWeek(weeknumber = getCurrentWeek(), year = getYear(new Date())) {
  return startOfWeek(new Date(year, 0, 1 + (weeknumber - 1) * 7), { weekStartsOn: 1 });
}

function getEndWeek(weeknumber = getCurrentWeek(), year = getYear(new Date())) {
  return endOfWeek(new Date(year, 0, 1 + (weeknumber - 1) * 7), { weekStartsOn: 1 });
}

function getCurrentYear() {
  return getYear(new Date());
}

module.exports = {
  getCurrentWeek,
  generateWeek,
  fillMissingDates,
  generateDates,
  getStartWeek,
  getEndWeek,
  getCurrentYear
};