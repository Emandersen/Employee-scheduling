const express = require('express');
const router = express.Router();
const personal_schedule_controller = require('../controllers/personalscheduleController');

router.get('/', personal_schedule_controller.GET_personal_schedule);
router.post('/release-shift', personal_schedule_controller.POST_release_shift);
router.post('/unrelease-shift', personal_schedule_controller.POST_unrelease_shift);

module.exports = router;