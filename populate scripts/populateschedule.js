console.log('Hey Hey');

const userArgs = process.argv.slice(2);

const Personalschedule = require("../models/schedule");

const personalschedule = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
  
const mongoDB = userArgs[0];
  
main().catch((err) => console.log(err));

async function main() {
  console.log('connecting');
  await mongoose.connect(mongoDB);
  console.log('connected?');
  await createPersonalschedules();
  console.log('closing');
  mongoose.connection.close();
}

async function personalscheduleCreate(email, date, workHours, startTime, endTime, role, department, location, released) {
  const personalscheduledetail = {
    email: email,
    date: date,
    workHours: workHours,
    startTime: startTime,
    endTime: endTime,
    role: role,
    department: department,
    location: location,
    released: released
  };

  const personalschedule = new Personalschedule(personalscheduledetail);
  await personalschedule.save();
  console.log(`added personal hours starting from ${startTime} to ${endTime} with the role of ${role}.`);
}

async function createPersonalschedules() {
  console.log('Adding schedules');
  await Promise.all([
    personalscheduleCreate("john.doe@example.com", "2024-03-01", 8, "09:00", "17:00", "Nurse", "Emergency", "Hvidovre", false),
    personalscheduleCreate("jane.doe@example.com", "2024-04-01", 8, "10:00", "18:00", "Nurse", "Emergency", "Hvidovre", false),
    personalscheduleCreate("jim.doe@example.com", "2024-04-05", 6, "10:00", "16:00", "Nurse", "Emergency", "Herlev", false),
    personalscheduleCreate("alice.smith@example.com", "2024-03-25", 10, "08:00", "18:00", "Nurse", "ICU", "Odense", false),
    personalscheduleCreate("bob.johnson@example.com", "2024-03-29", 8, "08:00", "16:00", "Nurse", "ICU", "Hvidovre", false),
    personalscheduleCreate("charlie.williams@example.com", "2024-04-09", 8, "06:00", "14:00", "Nurse", "Operating", "Amager", false),
    personalscheduleCreate("diana.brown@example.com", "2024-04-19", 6, "08:00", "14:00", "Nurse", "Operating", "Amager", false),
    personalscheduleCreate("ethan.jones@example.com", "2024-04-08", 4, "10:00", "14:00", "Nurse", "Emergency", "Gentofte", false),
    personalscheduleCreate("fiona.miller@example.com", "2024-04-03", 8, "12:00", "20:00", "Nurse", "Emergency", "Gentofte", false)
  ]);
  console.log('Users added');
}