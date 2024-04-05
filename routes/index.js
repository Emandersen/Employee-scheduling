const express = require('express');
const router = express.Router();
const personal_schedule_controller = require('../controllers/personalscheduleController');
const login_controller = require('../controllers/loginController');

router.get('/login', login_controller.GET_login);
router.post('/login', login_controller.POST_login);
router.get('/logout', login_controller.GET_logout);
router.post('/login', login_controller.POST_login);

    
router.get('/', function (req, res) {
    if (login_controller.checkSession(req, res)) {
        personal_schedule_controller.GET_personal_schedule
    } else {
        res.redirect("/login");
    }
});
router.post('/release-shift', function (req, res) {
    if (login_controller.checksession(req, res)) {
        personal_schedule_controller.POST_release_shift
    } else {
        res.redirect("/login");
    }
});
router.post('/unrelease-shift', function (req, res) {
    if (login_controller.checksession(req, res)) {
        personal_schedule_controller.POST_unrelease_shift
    } else {
        res.redirect("/login");
    }
});

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