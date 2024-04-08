const userModel = require('../models/user.js');
const express = require('express');
const router = express.Router();


const GET_register = function (req, res) {
    res.render('register', { title: 'Register' });
};

const POST_register = async function (req, res) {
    res.send('POST register');
};

module.exports = {
    GET_register,
    POST_register
};