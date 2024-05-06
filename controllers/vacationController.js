const express = require("express");
const bcrypt = require('bcrypt');
const User = require("../models/user");

function GET_login(req, res) {
    if (req.session && req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", { title: "Login" });
    }
};

module.exports = {
    GET_login
};