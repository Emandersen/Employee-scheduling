console.log('Hey Hey');

const userArgs = process.argv.slice(2);

const Personalschedule = require("../models/personalschedule");

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

async function personalscheduleCreate(personal_id, date, workHours, startTime, endTime, role, department, location, released) {
  const personalscheduledetail = {
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
    personalschedules[personal_id] = personalschedule;
    console.log(`added personal hours starting from ${startTime} to ${endTime} with the role of ${role}.`);
}

async function createPersonalschedules() {
    console.log('Adding schedules')
}