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



async function POST_approve_all_vacations(req, res) {
	try {
		const doc = await userModel.findOne({ email: req.body.user });
		if (!doc) {
			return res.status(404).send({ error: 'User not found.' });
		}
		const update = { $set: {} };
		doc.vacationDays.forEach((day, index) => {
			update.$set[`vacationDays.${index}.0`] = true;
		});
		await userModel.updateOne({ email: req.body.user }, update);
		res.status(200).send({ message: 'All vacations approved successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while approving the vacations.' });
	}
}

async function POST_delete_all_vacations(req, res) {
	try {
		const doc = await userModel.findOne({ email: req.body.user });
		if (!doc) { 
			return res.status(404).send({ error: 'User not found.' });
		}
		const update = { $unset: {} };
		doc.vacationDays.forEach((day, index) => {
			update.$unset[`vacationDays.${index}`] = 1;
		});
		await userModel.updateOne({ email: req.body.user }, update);
		await userModel.updateOne({ email: req.body.user }, { $pull: { vacationDays: null } });
		res.status(200).send({ message: 'All vacations deleted successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while deleting the vacations.' });
	}
}

async function POST_approve_vacation(req, res) {
	try {
		const doc = await userModel.findOne({ email: req.body.user });
		if (!doc) {
			return res.status(404).send({ error: 'User not found.' });
		}
		const index = doc.vacationDays.findIndex(day => day[1] === req.body.date);
		if (index === -1) {
			return res.status(404).send({ error: 'Vacation day not found.' });
		}
		const update = { $set: {} };
		update.$set[`vacationDays.${index}.0`] = true;
		await userModel.updateOne({ email: req.body.user }, update);
		res.status(200).send({ message: 'Vacation approved successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while approving the vacation.' });
	}
}

async function POST_delete_vacation(req, res) {
	try {
		const doc = await userModel.findOne({ email: req.body.user });
		if (!doc) {
			return res.status(404).send({ error: 'User not found.' });
		}
		const index = doc.vacationDays.findIndex(day => day[1] === req.body.date);
		if (index === -1) {
			return res.status(404).send({ error: 'Vacation day not found.' });
		}
		const update = { $unset: {} };
		update.$unset[`vacationDays.${index}`] = 1;
		await userModel.updateOne({ email: req.body.user }, update);
		await userModel.updateOne({ email: req.body.user }, { $pull: { vacationDays: null } });
		res.status(200).send({ message: 'Vacation deleted successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while deleting the vacation.' });
	}
}	

module.exports = {
	GET_planning_tool,
	POST_publish_plan,
	POST_add_shift,
	POST_delete_shift,
	POST_approve_vacation,
	POST_delete_vacation,
	POST_approve_all_vacations,
	POST_delete_all_vacations

};