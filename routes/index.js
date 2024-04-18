const express = require('express');
const router = express.Router();

const personal_schedule_controller = require('../controllers/personalscheduleController');
const team_schedule_controller = require('../controllers/teamscheduleController');
const user_controller = require('../controllers/userController');
const planning_controller = require('../controllers/planningController');


router.get('/login', user_controller.GET_login);
router.post('/login',  user_controller.POST_login);
router.get('/logout', user_controller.GET_logout);
router.post('/login', user_controller.POST_login);



router.get('/', user_controller.checkSession, personal_schedule_controller.GET_personal_schedule);
router.post('/toggle-shift/:dayId', user_controller.checkSession, personal_schedule_controller.POST_toggle_shift);

router.get('/register', user_controller.checkSessionAndPermissions(2), user_controller.GET_register);
router.post('/register', user_controller.checkSessionAndPermissions(2), user_controller.POST_register);

router.get('/manage-users', user_controller.checkSessionAndPermissions(2), user_controller.GET_manage_users);
router.get('/edit-user/:email', user_controller.checkSessionAndPermissions(2), user_controller.GET_edit_user);
router.post('/edit-user/:email', user_controller.checkSessionAndPermissions(2), user_controller.POST_edit_user);
router.post('/delete-user/:email', user_controller.checkSessionAndPermissions(2), user_controller.POST_delete_user);
router.post('/reset-password/:email', user_controller.checkSessionAndPermissions(2), user_controller.POST_reset_password);


router.get('/team_schedule/:yearId-:weekId', user_controller.checkSession, team_schedule_controller.GET_team_schedule);
router.get('/team_schedule/', user_controller.checkSession, team_schedule_controller.GET_team_schedule);

router.get('/team_schedule', user_controller.checkSession, team_schedule_controller.GET_team_schedule);

router.get('/planning-tool', user_controller.checkSessionAndPermissions(1), planning_controller.GET_planning_tool);
router.post('/planning-tool/add-shift/', user_controller.checkSessionAndPermissions(1), planning_controller.POST_add_shift);

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