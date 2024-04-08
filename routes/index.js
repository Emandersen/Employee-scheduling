const express = require('express');
const router = express.Router();
const personal_schedule_controller = require('../controllers/personalscheduleController');
const team_schedule_controller = require('../controllers/teamscheduleController');
const login_controller = require('../controllers/loginController');


router.get('/login', login_controller.GET_login);
router.post('/login', login_controller.POST_login);
router.get('/logout', login_controller.GET_logout);
router.post('/login', login_controller.POST_login);

    
router.get('/', login_controller.checkSession, personal_schedule_controller.GET_personal_schedule);
router.post('/release-shift', login_controller.checkSession, personal_schedule_controller.POST_release_shift);
router.post('/unrelease-shift', login_controller.checkSession, personal_schedule_controller.POST_unrelease_shift);


// 500 handler
router.use(function (err, req, res, next) {
    console.error(err.stack); // Log error stack to console
    res.status(500).send('Something broke!'); // Send error message to client
});

// 404 handler
router.use(function (req, res, next) {
    res.status(404).send('Sorry, we cannot find that!');
});

router.get('/team_schedule', team_schedule_controller.GET_team_schedule);

module.exports = router;