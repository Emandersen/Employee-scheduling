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

async function POST_add_preferences(req, res) {
    try {
        const user = await User.findOne({ email: req.session.user.email });

        if (!user) {
            res.redirect('/?error=User not found');
            return;
        }

        // Toggle preference in the user's preferences
        const preference = req.body.addPreference;
        const index = user.preferences.indexOf(preference);
        if (index !== -1) {
            // Redirect to error page if preference already exists
            res.redirect('/?error=Preference already exists');
            return;
        }

        // Add preference if it's not already in the user's preferences
        user.preferences.push(preference);

        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.redirect('/?error=An error occurred');
    }
}


async function POST_remove_preference(req, res) {
    try {
        const user = await User.findOne({ email: req.session.user.email });

        if (!user) {
            res.redirect('/?error=User not found');
            return;
        }

        // remove preference if it exists
        const preference = req.query.preference;
        const index = user.preferences.indexOf(preference);
        if (index === -1) {
            // Redirect to error page if preference does not exist
            res.redirect('/?error=Preference does not exist');
            return;
        }

        user.preferences.splice(index, 1);

        await user.save();

        res.redirect('/profile');
    }
    catch (error) {
        console.error(error);
        res.redirect('/?error=An error occurred');
    }
}

function GET_statistics(req, res) {
    res.render('statistics', {

    })
}
        



module.exports = {
    GET_profile_page,
    POST_add_preferences,
    POST_remove_preference,
    GET_statistics
};