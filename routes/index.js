const express = require('express');
const router = express.Router();

const personal_schedule_controller = require('../controllers/personalscheduleController');
const team_schedule_controller = require('../controllers/teamscheduleController');
const user_controller = require('../controllers/userController');


router.get('/login', user_controller.GET_login);
router.post('/login',  user_controller.POST_login);
router.get('/logout', user_controller.GET_logout);
router.post('/login', user_controller.POST_login);


router.get('/', user_controller.checkSession, personal_schedule_controller.GET_personal_schedule);
router.post('/release-shift', user_controller.checkSession, personal_schedule_controller.POST_release_shift);
router.post('/unrelease-shift', user_controller.checkSession, personal_schedule_controller.POST_unrelease_shift);

router.get('/register', user_controller.checkSessionAndPermissions(2), user_controller.GET_register);
router.post('/register', user_controller.checkSessionAndPermissions(2), user_controller.POST_register);

router.get('/team_schedule',user_controller.checkSession, team_schedule_controller.GET_team_schedule);

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