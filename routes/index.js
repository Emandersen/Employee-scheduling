const express = require('express');
const router = express.Router();
const personal_schedule_controller = require('../controllers/personalscheduleController');
const team_schedule_controller = require('../controllers/teamscheduleController');

router.get('/', personal_schedule_controller.GET_personal_schedule);
router.post('/release-shift', personal_schedule_controller.POST_release_shift);
router.post('/unrelease-shift', personal_schedule_controller.POST_unrelease_shift);

router.get('/team_schedule', team_schedule_controller.GET_team_schedule);

module.exports = router;