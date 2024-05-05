// import models
const PersonalSchedule = require('../models/schedule');
const User = require('../models/user');

async function GET_profile_page(req, res) {
    try {
        const user = await User.findOne({ email: req.session.user.email });
        const personalSchedule = await PersonalSchedule.find({ email: req.session.user.email });

        res.render('profile', {
            title: 'Profile',
            user,
            personalSchedule,
            availablePreferences: ['email', 'firstName', 'lastName', 'role', 'department'],
    });
  } catch (error) {
    console.error(error);
    res.redirect('/?error=An error occurred');
  }
}

module.exports = {
  GET_profile_page,
};