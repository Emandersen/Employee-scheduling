const express = require('express');
const router = express.Router();

const personal_schedule_controller = require('../controllers/personalscheduleController');
const team_schedule_controller = require('../controllers/teamscheduleController');
const user_controller = require('../controllers/userController');
const planning_controller = require('../controllers/planningController');
const profile_controller = require('../controllers/profileController');

// user authentication
router.get('/login', user_controller.GET_login);
router.post('/login',  user_controller.POST_login);
router.get('/logout', user_controller.GET_logout);
router.post('/login', user_controller.POST_login);


// user registration
router.get('/register', user_controller.checkSessionAndPermissions(2), user_controller.GET_register);
router.post('/register', user_controller.checkSessionAndPermissions(2), user_controller.POST_register);

// manage users
router.get('/manage-users', user_controller.checkSessionAndPermissions(2), user_controller.GET_manage_users);
router.get('/edit-user/:email', user_controller.checkSessionAndPermissions(2), user_controller.GET_edit_user);
router.post('/edit-user/:email', user_controller.checkSessionAndPermissions(2), user_controller.POST_edit_user);
router.post('/delete-user/:email', user_controller.checkSessionAndPermissions(2), user_controller.POST_delete_user);
router.post('/reset-password/:email', user_controller.checkSessionAndPermissions(2), user_controller.POST_reset_password);


// Team schedule
router.get('/team_schedule/:year?-:week?', user_controller.checkSession, team_schedule_controller.GET_team_schedule);
router.get('/team_schedule/', user_controller.checkSession, team_schedule_controller.GET_team_schedule);

// Statistics
router.get('/statistics', user_controller.checkSession, profile_controller.GET_statistics);

// Planning tool
router.get('/planning-tool', user_controller.checkSessionAndPermissions(1), planning_controller.GET_planning_tool);
router.post('/planning-tool/add-shift/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_add_shift);
router.post("/planning-tool/delete-shift/", user_controller.checkSessionAndPermissions(1), planning_controller.POST_delete_shift);

router.post('/planning-tool/approve-vacation/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_approve_vacation);
router.post('/planning-tool/delete-vacation/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_delete_vacation);
router.post('/planning-tool/approve-all-vacation/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_approve_all_vacations);
router.post('/planning-tool/delete-all-vacation/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_delete_all_vacations);
router.post('/planning-tool/disapprove-vacation/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_disapprove_vacation);
router.post('/planning-tool/disapprove-all-vacation/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_disapprove_all_vacations);

router.post('/planning-tool/add-shift-every/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_add_shift_everyday);
router.post('/planning-tool/delete-shifts-timeframe/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_delete_schedule_in_range);

// Profile page
router.get('/profile', user_controller.checkSession, profile_controller.GET_profile_page);
router.post('/profile/add-preferences', user_controller.checkSession, profile_controller.POST_add_preferences);
router.post('/profile/remove-preference', user_controller.checkSession, profile_controller.POST_remove_preference);
router.post('/profile/change-password', user_controller.checkSession, user_controller.POST_change_password);

// Personal schedule
router.get('/', user_controller.checkSession, personal_schedule_controller.GET_personal_schedule);
router.post('/toggle-shift/:dayId', user_controller.checkSession, personal_schedule_controller.POST_toggle_shift);
router.post('/request-vacation/:dayId', user_controller.checkSession, personal_schedule_controller.POST_toggle_vacation);
router.get('/released-shifts', user_controller.checkSession, personal_schedule_controller.GET_released_shifts);
router.post('/stamp-in', user_controller.checkSession, personal_schedule_controller.POST_stamp_in);
router.post('/stamp-out', user_controller.checkSession, personal_schedule_controller.POST_stamp_out);




// 500 handler
router.use(function (err, req, res, next) {
    console.error(err.stack); // Log error stack to console
    res.status(500).send('Something broke!'); // Send error message to client
});

// 404 handler
router.use(function (req, res, next) {
    res.status(404).send('Sorry, we cannot find that!');
});

module.exports = router;