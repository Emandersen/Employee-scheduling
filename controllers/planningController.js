const moment = require('moment');
const dateHandler = require('../functions/dateHandler');
const userModel = require('../models/user');
const scheduleModel = require('../models/schedule');
const constraintHandler = require('../functions/hardConstraints');


async function GET_planning_tool(req, res) {
	// get all users
	const users = await userModel.find();
	// get schedules 12 months ahead and 6 months back
	const today = new Date();
	const start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
	const end = new Date(today.getFullYear(), today.getMonth() + 12, 1);
	const schedules = await scheduleModel.find({ date: { $gte: start, $lt: end } });

	// Create a new array of users
	const usersWithSchedules = users.map(user => {
		user = user.toObject(); // Convert Mongoose object to a regular JavaScript object
		const userSchedules = schedules.filter(schedule => schedule.email === user.email);
		const datesWithSchedules = dateHandler.fillMissingDates(start, end, userSchedules, user);
		user.schedules = datesWithSchedules;
		return user;
	});

	dates = dateHandler.generateDates(start, end);
	
	res.render('planning_tool', {users: usersWithSchedules, dates: dates, title: 'Planning Tool', moment: moment});
}

async function POST_add_shift(req, res) {

	const schedule = await scheduleModel.findOne({ email: req.body.user, date: req.body.date });
	const user = await userModel.findOne({ email: req.body.user });

	var startTime = new Date(req.body.date + "T" + req.body.startTime);
	var endTime = new Date(req.body.date + "T" + req.body.endTime);
	

	allSchedules = await scheduleModel.find({ email: req.body.user });
	
	var diff = (endTime - startTime) / 1000 / 60 / 60;
	// Previously used to check if constraints were working, now unit tests are used 
	/*
	console.log(constraintHandler.checkHardConstraints(allSchedules, user)); 
	*/


	// add to schedule 
	const newSchedule = new scheduleModel({
		email: user.email,
		date: req.body.date,
		workHours: diff,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		role: user.role,
		department: user.department,
		location: req.body.location,
		released: false		
	});

	await newSchedule.save(); 
}

async function POST_delete_shift(req, res) {
	try {
		await scheduleModel.findOneAndDelete({ email: req.body.user, date: req.body.date });
	} catch (err) {
		console.log(err);
		
	}
}

async function POST_publish_plan(req, res) {
	console.log("publishing plan");
}
		

module.exports = {
	GET_planning_tool,
	POST_publish_plan,
	POST_add_shift,
	POST_delete_shift

};