var express = require('express');
var router = express.Router();

function GET_team_schedule(req, res) {
    res.render('team_schedule');
};

module.exports = {
    GET_team_schedule
};