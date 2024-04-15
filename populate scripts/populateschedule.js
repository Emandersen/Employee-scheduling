console.log('Hey Hey');

const Personalschedule = require("../models/schedule");

const DB_USER = "testuser123321";
const DB_PASS = "5DtfQaMEaF0vb9Vn";

const dev_db_url = "mongodb+srv://" + DB_USER + ":" + DB_PASS + "@databaseNumber1.bxvhltu.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseNumber1";

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);


async function dbConnection() {
    try {
        await mongoose.connect(dev_db_url);
        console.log("Connected to the database");
    } catch (error) {
        console.log("Could not connect to the database", error);
    }
}

dbConnection();

async function personalscheduleCreate(email, date, workHours, startTime, endTime, role, department, location, released) {
  const personalscheduledetail = {
    email: email,
    date: date,
    workHours: workHours,
    startTime: startTime,
    endTime: endTime, // endTime is now a string
    role: role,
    department: department,
    location: location,
    released: released
  };

  const personalschedule = new Personalschedule(personalscheduledetail);
  await personalschedule.save();
  console.log(`added personal hours starting from ${startTime} to ${endTime} with the role of ${role}.`);
}

function calculateHours(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  const diff = end - start;
  const hours = diff / (1000 * 60 * 60);
  return hours;
}

function generatePersonalSchedule(numEntries) {
  const emails = [
    'john.doe@example.com',
    'jane.doe@example.com',
    'jim.doe@example.com',
    'alice.smith@example.com',
    'bob.johnson@example.com',
    'charlie.williams@example.com',
    'diana.brown@example.com',
    'ethan.jones@example.com',
    'fiona.miller@example.com',
    'user@user.com'
  ];
  
  const departments = ["Emergency", "ICU", "Operating"];
  const location = "Hvidovre";
  const schedules = [];
  const uniqueEmailDates = new Map();

  numEntries = Math.min(numEntries, emails.length * 150); // limit numEntries to the number of unique emails times 150 (roughly the number of workdays in the date range)

  while (schedules.length < numEntries) {
    const email = emails[schedules.length % emails.length];
    let date;
    let datesForEmail = uniqueEmailDates.get(email) || new Set();
    let attempts = 0;

    do {
      date = randomDate().toISOString().split('T')[0];
      attempts++;
      // If we've tried 1000 times and can't find a date, break to avoid infinite loop
      if (attempts > 1000) {
        console.log('Could not find a unique date after 1000 attempts, breaking...');
        break;
      }
    } while (datesForEmail.has(date) || !isValidWorkday(date, datesForEmail));

    datesForEmail.add(date);
    uniqueEmailDates.set(email, datesForEmail);

    const startTime = ["06:00", "08:00", "09:00", "10:00", "12:00"][Math.floor(Math.random() * 5)];
    const endTime = ["14:00", "16:00", "17:00", "18:00", "20:00"][Math.floor(Math.random() * 5)];
    const hours = calculateHours(startTime, endTime);
    const role = "Nurse";
    const department = departments[schedules.length % departments.length];
    const isHoliday = false;

    schedules.push(personalscheduleCreate(email, date, hours, startTime, endTime, role, department, location, isHoliday));
  }

  console.log(`Generated ${schedules.length} schedules`);
  return schedules;
}

function randomDate() {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const end = new Date();
  end.setDate(end.getDate() + 120);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function isValidWorkday(date, datesForEmail) {
  const dayOfWeek = new Date(date).getDay();
  const workdaysThisWeek = Array.from(datesForEmail).filter(d => {
    const otherDate = new Date(d);
    return otherDate.getDay() === dayOfWeek && Math.abs(otherDate.getDate() - new Date(date).getDate()) < 7;
  }).length;
  // If it's Saturday or Sunday, or if there are already 5 workdays this week, it's not a valid workday
  return dayOfWeek !== 0 && dayOfWeek !== 6 && workdaysThisWeek < 5;
}

async function createPersonalschedules() {
  console.log('Adding schedules');
  await Promise.all(generatePersonalSchedule(1000));
  console.log('Users added');
}

createPersonalschedules();