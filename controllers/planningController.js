const moment = require('moment');
const dateHandler = require('../functions/dateHandler');
const userModel = require('../models/user');
const scheduleModel = require('../models/schedule');
const hardConstraintHandler = require('../functions/hardConstraints');
const softConstraintHandler = require('../functions/softConstraints');


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
	
	// Sort vacation by dates in users
	usersWithSchedules.forEach(user => {
		user.vacationDays.sort((a, b) => {
			return new Date(a[1]) - new Date(b[1]);
		});
	});

	res.render('planning_tool', {users: usersWithSchedules, dates: dates, title: 'Planning Tool', moment: moment});
}

async function POST_add_shift(req, res) {

	const schedule = await scheduleModel.findOne({ email: req.body.user, date: req.body.date });
	const user = await userModel.findOne({ email: req.body.user });

	var startTime = new Date(req.body.date + "T" + req.body.startTime);
	var endTime = new Date(req.body.date + "T" + req.body.endTime);
	

	allSchedules = await scheduleModel.find({ email: req.body.user });
	
	var diff = (endTime - startTime) / 1000 / 60 / 60;

	// check if the user has a shift that day
	if (schedule) {
		return res.status(410).send({ error: 'User already has a shift that day.' });
	}

	// Check hard constraints
	if (!hardConstraintHandler.checkHardConstraints(allSchedules, user)) {
		return res.status(420).send({ error: 'Hard constraints not met.' });
	}

	// Check soft constraints
	if (!softConstraintHandler.checkSoftConstraints(allSchedules, user)) {
		return res.status(430).send({ error: 'Soft constraints not met.' });
	}
	


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

async function POST_disapprove_vacation(req, res) {
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
		update.$set[`vacationDays.${index}.0`] = false;
		await userModel.updateOne({ email: req.body.user }, update);
		res.status(200).send({ message: 'Vacation disapproved successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while disapproving the vacation.' });
	}
}

async function POST_disapprove_all_vacations(req, res) {
	try {
		const doc = await userModel.findOne({ email: req.body.user });
		if (!doc) {
			return res.status(404).send({ error: 'User not found.' });
		}
		const update = { $set: {} };
		doc.vacationDays.forEach((day, index) => {
			update.$set[`vacationDays.${index}.0`] = false;
		});
		await userModel.updateOne({ email: req.body.user }, update);
		res.status(200).send({ message: 'All vacations disapproved successfully.' });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while disapproving the vacations.' });
	}
}

async function POST_add_shift_everyday(req, res) {
	console.log(req.body);
	try {
		// Validate user
		const user = await userModel.findOne({ email: req.body.user });
		if (!user) {
			return res.status(400).send({ message: 'User not found' });
		}

		// Validate dates
		const startWeek = new Date(req.body.startWeek);
		const endWeek = new Date(req.body.endWeek);
		if (startWeek > endWeek) {
			return res.status(400).send({ message: 'Start week cannot be after end week' });
		}

		// Map days of the week to numbers (week starts on Monday)
		const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		const dayOfWeekNumber = daysOfWeek.indexOf(req.body.dayOfWeek);
		if (dayOfWeekNumber === -1) {
			return res.status(400).send({ message: 'Invalid day of the week' });
		}

		// Create a new schedule for each week
		for (let currentWeek = new Date(startWeek); currentWeek <= endWeek; currentWeek.setDate(currentWeek.getDate() + 7)) {
			// Make sure the schedule is on the correct day of the week
			currentWeek.setDate(currentWeek.getDate() + ((7 + dayOfWeekNumber - ((currentWeek.getDay() + 6) % 7)) % 7));

			// Check if a schedule already exists for this date
			const existingSchedule = await scheduleModel.findOne({ email: user.email, date: new Date(currentWeek) });
			if (existingSchedule) {
				// Skip this iteration and continue with the next one
				continue;
			}

			// Calculate workHours
			const startTime = new Date(`1970-01-01T${req.body.startTime}Z`);
			const endTime = new Date(`1970-01-01T${req.body.endTime}Z`);
			const diff = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours

			// Create new schedule
			const newSchedule = new scheduleModel({
				email: user.email,
				date: new Date(currentWeek),
				workHours: diff,
				startTime: req.body.startTime,
				endTime: req.body.endTime,
				role: user.role,
				department: user.department,
				location: req.body.location,
				released: false
			});

			// Save new schedule
			await newSchedule.save();
		}

		// Send response
		res.send({ message: 'Schedules added successfully' });
	} catch (error) {
		res.status(500).send({ error: 'An error occurred while adding the schedules' });
		console.error(error);
	}
}

async function POST_delete_schedule_in_range(req, res) {
	try {
		// Validate user
		const user = await userModel.findOne({ email: req.body.user });
		if (!user) {
			return res.status(400).send({ message: 'User not found' });
		}

		// Validate dates
		const startDate = new Date(req.body.startDate);
		const endDate = new Date(req.body.endDate);
		if (startDate > endDate) {
			return res.status(400).send({ message: 'Start date cannot be after end date' });
		}

		// Delete all schedules in the range
		await scheduleModel.deleteMany({
			user: req.body.user,
			date: { $gte: startDate, $lte: endDate }
		});

		// Send response
		res.send({ message: 'Schedules deleted successfully' });

	}
	catch (error) {
		res.status(500).send({ error: 'An error occurred while deleting the schedules' });
	}
}

	
module.exports = {
	GET_planning_tool,
	POST_add_shift,
	POST_delete_shift,
	POST_approve_vacation,
	POST_delete_vacation,
	POST_approve_all_vacations,
	POST_delete_all_vacations,
	POST_disapprove_vacation,
	POST_disapprove_all_vacations,
	POST_add_shift_everyday,
	POST_delete_schedule_in_range
};